import express, { Request, Response, NextFunction } from 'express';
import { validateId , validateNewPostData } from '../middlewares/validator';
import verifyUserAccessToken from '../middlewares/verifyUserAccessToken';

import {
  createPost,
  toggleLike,
  commentOnPost,
  deletePost,
  getAllPosts
} from '../controllers/post.controller';

import ROUTES from '../constants/routes';


const { 
  GET_ALL_POSTS_PATH,
  CREATE_POST_PATH,
  LIKE_POST_PATH,
  COMMENT_POST_PATH,
  DELETE_POST_PATH
} = ROUTES.V1.POST;


const router = express.Router();


function validateIdFields(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  validateId(['id', 'userId'], req, res, next);
}


router.get(GET_ALL_POSTS_PATH, verifyUserAccessToken, getAllPosts);

router.post(
  CREATE_POST_PATH,
  validateNewPostData,
  verifyUserAccessToken,
  createPost
);

router.post(
  LIKE_POST_PATH, 
  validateIdFields, 
  verifyUserAccessToken, 
  toggleLike
);

router.post(
  COMMENT_POST_PATH, 
  validateIdFields, 
  verifyUserAccessToken, 
  commentOnPost
);

router.delete(
  DELETE_POST_PATH, 
  validateIdFields, 
  verifyUserAccessToken, 
  deletePost
);
      
export default router;
