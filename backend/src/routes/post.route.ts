import express, { Request, Response, NextFunction } from 'express';
import { validateId } from '../middlewares/validator';
import verifyUserAccessToken from '../middlewares/verifyUserAccessToken';
import {
  createPost,
  toggleLike,
  commentOnPost
} from '../controllers/post.controller';

const router = express.Router();


function validateIdFields(
  req: Request, 
  res: Response,
  next: NextFunction
): void {
  validateId(['id', 'userId'], req, res, next);
}


router.post('', validateIdFields, verifyUserAccessToken, createPost)
      .post('/:id/like', validateIdFields, verifyUserAccessToken, toggleLike)
      .post('/:id/comment', validateIdFields, commentOnPost);

export default router;