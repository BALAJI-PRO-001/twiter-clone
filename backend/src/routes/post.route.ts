import express, { Request, Response, NextFunction } from 'express';
import { validateId , validateNewPostData } from '../middlewares/validator';
import verifyUserAccessToken from '../middlewares/verifyUserAccessToken';
import {
  createPost,
  toggleLike,
  commentOnPost,
  deletePost
} from '../controllers/post.controller';

const router = express.Router();


function validateIdFields(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  validateId(['id', 'userId'], req, res, next);
}


router.post(
  '',
  validateNewPostData,
  verifyUserAccessToken,
  createPost
);

router.post('/:id/like', validateIdFields, verifyUserAccessToken, toggleLike)
      .post('/:id/comment', validateIdFields, verifyUserAccessToken, commentOnPost);


router.delete('/:id', validateIdFields, verifyUserAccessToken, deletePost);
      
export default router;
