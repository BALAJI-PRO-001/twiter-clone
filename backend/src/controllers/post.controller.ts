import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';
import Post from '../models/post.modal';  
import { createHTTPError } from '../lib/utils/common';
import { StatusCodes as STATUS_CODES } from 'http-status-codes';
import { v2 as cloudinary } from 'cloudinary';
import { 
  NOT_FOUND_ERROR_MESSAGES,
  UNAUTHORIZED_ACCESS_ERROR_MESSAGES
} from '../constants/httpErrorMessages';



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
    res.status(STATUS_CODES.OK).json({
      success: true,
      statusCode: STATUS_CODES.OK,
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

}



export async function commentOnPost(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {

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