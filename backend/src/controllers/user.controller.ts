import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';
import { createHTTPError, sanitizeUserAndFormat } from '../lib/utils/common';
import Notification from '../models/notification.model';
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';
import { StatusCodes as STATUS_CODES, StatusCodes } from 'http-status-codes';

import { 
  BAD_REQUEST_ERROR_MESSAGES, 
  NOT_FOUND_ERROR_MESSAGES, 
  UNAUTHORIZED_ACCESS_ERROR_MESSAGES 
} from '../constants/httpErrorMessages';

import {
  FOLLOWER_ID_NOT_PROVIDED  
} from '../constants/validationMessages';


export async function getUser(
  req: Request, 
  res: Response,
  next: NextFunction
) {

  try {
    if (req.verifiedUserId !== req.params.id) {
      return next(createHTTPError(
        STATUS_CODES.UNAUTHORIZED,
        UNAUTHORIZED_ACCESS_ERROR_MESSAGES.USER.INVALID_USER_ID
      ));
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        statusCode: STATUS_CODES.NOT_FOUND,
        message: NOT_FOUND_ERROR_MESSAGES.USER
      });
      return;
    }

    res.status(STATUS_CODES.OK).json({
      success: true,
      statusCode: STATUS_CODES.OK,
      data: sanitizeUserAndFormat(user)
    });
  } catch(err) {
    next(err);
  }
}



export async function toggleFollower(
  req: Request,
  res: Response,
  next: NextFunction
) {

  try {
    if (req.verifiedUserId !== req.params.id) {
      return next(createHTTPError(
        STATUS_CODES.UNAUTHORIZED,
        UNAUTHORIZED_ACCESS_ERROR_MESSAGES.USER.INVALID_USER_ID
      ));
    }

    const currentUserId = req.params.id;
    const { followerId } = req.body;

    if (!followerId) {
      return next(createHTTPError(
        STATUS_CODES.BAD_REQUEST,
        FOLLOWER_ID_NOT_PROVIDED
      ));
    }

    if (currentUserId === followerId) {
      return next(createHTTPError(
        STATUS_CODES.BAD_REQUEST, 
        BAD_REQUEST_ERROR_MESSAGES.INVALID_FOLLOWER
      ));
    }

    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return next(createHTTPError(
        STATUS_CODES.NOT_FOUND,
        NOT_FOUND_ERROR_MESSAGES.USER + ` ID: ${currentUserId}.`
      ));
    }

    const userToModify = await User.findById(followerId);
    if (!userToModify) {
      return next(createHTTPError(
        STATUS_CODES.NOT_FOUND,
        NOT_FOUND_ERROR_MESSAGES.USER + ` ID: ${followerId}.`
      ));
    }


    const isFollowing = currentUser.following.includes(followerId);
    if (isFollowing) { 
      await User.findByIdAndUpdate(followerId, { $pull: { followers: currentUserId }}); 
      await User.findByIdAndUpdate(currentUserId, { $pull: { following: followerId }});
      res.status(STATUS_CODES.OK).json({
        success: true,
        statusCode: STATUS_CODES.OK,
        message: 'User unfollowed successfully.'
      });
    } else {
      await User.findByIdAndUpdate(followerId, { $push: { followers: currentUserId }});
      await User.findByIdAndUpdate(currentUserId, { $push: { following: followerId }});

      const newNotification = new Notification({
        type: 'follow',
        from: currentUserId,
        to: followerId
      });
      await newNotification.save();

      res.status(STATUS_CODES.OK).json({
        success: true,
        statusCode: STATUS_CODES.OK,
        message: 'User followed successfully.'
      });
    }
  } catch(err) {
    next(err);
  }
}



export async function getSuggestedUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {

  try {
    if (req.verifiedUserId !== req.params.id) {
      return next(createHTTPError(
        STATUS_CODES.UNAUTHORIZED,
        UNAUTHORIZED_ACCESS_ERROR_MESSAGES.USER.INVALID_USER_ID
      ));
    }

    const currentUserId = new mongoose.Types.ObjectId(req.params.id);
    const usersFollowedByMe = await User.findById(currentUserId).select('following');
    if (!usersFollowedByMe) {
      return next(createHTTPError(
        STATUS_CODES.NOT_FOUND, 
        NOT_FOUND_ERROR_MESSAGES.USER
      ));
    }

    const users = await User.aggregate([
      { $match: { _id: { $ne: currentUserId } } },
      { $sample: { size: 10 } },
      { $project: { password: 0 } }
    ]); 

    const filteredUsers = users.filter((user) => {
      return !usersFollowedByMe.following.includes(user._id.toString());
    });

    const suggestedUsers = filteredUsers.slice(0, 4);
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      statusCode: STATUS_CODES.OK,
      data: {
        users: suggestedUsers
      }
    });
  } catch(err) {
    next(err);
  }
}



export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {

  try {
    if (req.verifiedUserId !== req.params.id) {
      return next(createHTTPError(
        STATUS_CODES.UNAUTHORIZED,
        UNAUTHORIZED_ACCESS_ERROR_MESSAGES.USER.INVALID_USER_ID
      ));
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        statusCode: STATUS_CODES.NOT_FOUND,
        message: NOT_FOUND_ERROR_MESSAGES.USER
      });
      return;
    }

    const { username, fullName, email, currentPassword, newPassword, bio, link } = req.body;
    let { profileImgURL, coverImgURL } = req.body;

    if (currentPassword && newPassword) {
      const isMatch = await bcryptjs.compare(currentPassword, user.password);
      if (!isMatch) {
        return next(createHTTPError(
          STATUS_CODES.UNAUTHORIZED,
          UNAUTHORIZED_ACCESS_ERROR_MESSAGES.PASSWORD
        ));
      }

      const salt = await bcryptjs.genSalt(10);
      user.password = await bcryptjs.hash(newPassword, salt);
    }

    if (profileImgURL) {
      if (user.profileImgURL) {
        const imgId = user.profileImgURL.split('/').pop()?.split('.')[0] as string;
        await cloudinary.uploader.destroy(imgId);
      }

      const uploadedResponse = await cloudinary.uploader.upload(profileImgURL);
      profileImgURL = uploadedResponse.secure_url;
    } 

    if (coverImgURL) {
       if (user.coverImgURL) {
        const imgId = user.coverImgURL.split('/').pop()?.split('.')[0] as string;
        await cloudinary.uploader.destroy(imgId);
      }     

      const uploadedResponse = await cloudinary.uploader.upload(coverImgURL);
      coverImgURL = uploadedResponse.secure_url;
    }

    user.username = username || user.username;
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.profileImgURL = profileImgURL || user.profileImgURL;
    user.coverImgURL = coverImgURL || user.coverImgURL;
    user.bio = bio || user.bio;
    user.link = link || user.link;

    const updatedUser = await user.save();
    res.status(STATUS_CODES.OK).json({
      success: true,
      statusCode: STATUS_CODES.OK,
      data: {
        user: sanitizeUserAndFormat(updatedUser)
      }
    });  
  } catch(err) {
    next(err);
  }
}



export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
) {

  try {
    if (req.verifiedUserId !== req.params.id) {
      return next(createHTTPError(
        STATUS_CODES.UNAUTHORIZED,
        UNAUTHORIZED_ACCESS_ERROR_MESSAGES.USER.INVALID_USER_ID
      ));
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        statusCode: STATUS_CODES.NOT_FOUND,
        message: NOT_FOUND_ERROR_MESSAGES.USER
      });
      return;
    }

    if (!user) {
      return next(createHTTPError(
        STATUS_CODES.NOT_FOUND,
        NOT_FOUND_ERROR_MESSAGES.USER
      ));
    }

    res.status(STATUS_CODES.NO_CONTENT).json({});
  } catch(err) {
    next(err);
  }
}