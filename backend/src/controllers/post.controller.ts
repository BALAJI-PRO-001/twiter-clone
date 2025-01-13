import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';
import Post from '../models/post.modal';  
import Notification from '../models/notification.model';
import { createHTTPError } from '../lib/utils/common';
import { StatusCodes as STATUS_CODES, StatusCodes } from 'http-status-codes';
import { v2 as cloudinary } from 'cloudinary';

import { 
  NOT_FOUND_ERROR_MESSAGES,
  UNAUTHORIZED_ACCESS_ERROR_MESSAGES
} from '../constants/httpErrorMessages';

import { TEXT_FIELD_NOT_PROVIDED } from '../constants/validationMessages';
import mongoose from 'mongoose';


export async function createPost(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {

  try {
    const userId = req.verifiedUserId;
    const user = await User.findById(userId);

    if (!user) {
      return next(createHTTPError(404, 'User not found.'));
    }

    const { text } = req.body;
    let { imgURL } = req.body;
 
    if (imgURL) {
      const uploadedResponse = await cloudinary.uploader.upload(imgURL); 
      imgURL = uploadedResponse.secure_url;
    } 

    const newPost = new Post({
      userRef: userId,
      text: text || "",
      imgURL: imgURL || "",
    }); 

    await newPost.save();
    res.status(STATUS_CODES.CREATED).json({
      success: true,
      statusCode: STATUS_CODES.CREATED,
      data: {
        post: newPost
      }
    });

  } catch(err) {
    next(err);
 }
}



export async function toggleLike(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  
  try {
    const postId = req.params.id;
    const userId = new mongoose.Types.ObjectId(req.verifiedUserId);

    const post = await Post.findById(postId);
    if (!post) {
      return next(createHTTPError(
        STATUS_CODES.NOT_FOUND,
        NOT_FOUND_ERROR_MESSAGES.POST
      ));
    }

    const isUserAlreadyLiked = post.likes.includes(userId);
    if (isUserAlreadyLiked) {
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId }});
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId }});
      res.status(STATUS_CODES.OK).json({
        success: true,
        statusCode: STATUS_CODES.OK,
        message: 'Post unliked successfully.'
      });
    } else {
      post.likes.push(userId);
      await User.updateOne({ _id: userId }, { $push: { likedPosts: postId }});
      await post.save();

      const newNotification = new Notification({
        from: userId,
        to: post.userRef,
        type: 'like'
      });

      res.status(STATUS_CODES.OK).json({
        success: true,
        statusCode: STATUS_CODES.OK, 
        message: 'Post liked successfully.'
      });
    }

  } catch(err) {

  }
}



export async function commentOnPost(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {

  try {
    const { text } = req.body;
    const postId = req.body.id;
    const userId = req.verifiedUserId;

    if (!text) {
      return next(createHTTPError(
        STATUS_CODES.BAD_REQUEST,
        TEXT_FIELD_NOT_PROVIDED
      )); 
    }

    const post = await Post.findById(postId);
    if (!post) {
      return next(createHTTPError(
        STATUS_CODES.NOT_FOUND,
        NOT_FOUND_ERROR_MESSAGES.POST
      ));
    }

    const comment = { userRef: userId, text: text };
    post.comments.push(comment);
    await post.save();

    res.status(STATUS_CODES.OK).json({
      success: true,
      statusCode: STATUS_CODES.OK,
      data: {
        post: post 
      }
    });
  } catch(err) {
    next(err);
  }
}



export async function deletePost(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {

  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return next(createHTTPError(
        STATUS_CODES.NOT_FOUND, 
        NOT_FOUND_ERROR_MESSAGES.POST
      ));
    }

    if (post.userRef.toString() !== req.verifiedUserId) {
      return next(createHTTPError(
        STATUS_CODES.UNAUTHORIZED,
        UNAUTHORIZED_ACCESS_ERROR_MESSAGES.POST.UNAUTHORIZED_OWNER
      ));
    }


    if (post.imgURL) {
      const imgId = post.imgURL.split('/').pop()?.split('.')[0] as string;
      await cloudinary.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(id);
    res.status(STATUS_CODES.NO_CONTENT).json({});
  } catch(err) {
    next(err);
  }
}



export async function getAllPosts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: 'userRef',
        select: '-password'
      })
      .populate({
        path: 'comments.userRef',
        select: '-password'
      });

    if (posts.length === 0) {
      posts = [];
    }

    res.status(STATUS_CODES.OK).json({
      success: true,
      statusCode: STATUS_CODES.OK,
      data: {
        posts: posts
      }
    });
  } catch(err) {
    next(err);
  } 
}



export async function getLikedPosts(
  req: Request, 
  res: Response,
  next: NextFunction
) {

  try {
    const userId = req.verifiedUserId;
    const user = await User.findById(userId);

    if (!user) {
      return next(createHTTPError(
        STATUS_CODES.NOT_FOUND,
        NOT_FOUND_ERROR_MESSAGES.USER
      ));
    }

    const posts = await Post.find({ _id: { $in: user.likedPosts }})
      .populate({
        path: 'userRef',
        select: '-password'
      })
      .populate({
        path: 'comments.userRef',
        select: '-password'
      });

    res.status(STATUS_CODES.OK).json({
      success: true,
      statusCode: STATUS_CODES.OK,
      data: { 
        posts: posts 
      }
    });
  } catch(err) {
    next(err);    
  }
}


export async function getFollowingPosts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  
  try {
    const userId = req.verifiedUserId;
    const user = await User.findById(userId);
    
    if (!user) {
      return next(createHTTPError(
        STATUS_CODES.NOT_FOUND,
        NOT_FOUND_ERROR_MESSAGES.USER
      ));
    }

    const posts = await Post.find({ userRef: { $in: user.following }})
      .sort({ createdAt: -1 })
      .populate({
        path: 'userRef',
        select: '-password'
      })
      .populate({
        path: 'comments.userRef',
        select: '-password'
      });

    res.status(STATUS_CODES.OK).json({
      success: true,
      statusCode: STATUS_CODES.OK,
      data: {
        posts: posts
      }
    });
  } catch(err) {
    next(err);
  }
}



export async function getUserPosts(
  req: Request, 
  res: Response,
  next: NextFunction
) {
  
  try {
    const username = req.params.username;
    const user = await User.findOne({ username });

    if (!user) {
      return next(createHTTPError(
        STATUS_CODES.NOT_FOUND,
        NOT_FOUND_ERROR_MESSAGES.USER
      ));
    }

    const posts = await Post.find({ userRef: user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: 'userRef',
        select: '-password'
      })
      .populate({
        path: 'comments.userRef',
        select: '-password'
      });

    res.status(STATUS_CODES.OK).json({
      success: true,
      statusCode: STATUS_CODES.OK,
      data: {
        posts: posts
      }
    });
  } catch(err) {
    next(err);
  }
}