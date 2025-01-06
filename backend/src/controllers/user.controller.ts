import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import { createHTTPError, sanitizeUserAndFormat } from "../lib/utils/common";
import Notification from "../models/notification.model";
import mongoose from 'mongoose';


export async function getUser(
  req: Request, 
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(createHTTPError(404, 'User not found.'));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
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
): Promise<void> {
  try {
    const currentUserId = req.params.id;
    const { followerId } = req.body;

    if (currentUserId === followerId) {
      return next(createHTTPError(400, `You can't follow or unfollow your self.`));
    }

    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return next(createHTTPError(404, `User not found in this id: ${currentUserId}`))
    }

    const userToModify = await User.findById(followerId);
    if (!userToModify) {
      return next(createHTTPError(404, `Follower not found in this id: ${followerId}`))
    }

    const isFollowing = currentUser.following.includes(followerId);
    if (isFollowing) { 
      await User.findByIdAndUpdate(followerId, { $pull: { followers: currentUserId }}); 
      await User.findByIdAndUpdate(currentUserId, { $pull: { following: followerId }});
      res.status(200).json({
        success: true,
        statusCode: 200,
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

      res.status(200).json({
        success: true,
        statusCode: 200,
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
    const currentUserId = new mongoose.Types.ObjectId(req.params.id);
    const usersFollowedByMe = await User.findById(currentUserId).select('following');
    if (!usersFollowedByMe) {
      return next(createHTTPError(404, 'User not found.'));
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
    
    res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        users: suggestedUsers
      }
    });
  } catch(err) {
    next(err);
  }
}