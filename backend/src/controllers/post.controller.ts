import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';
import { createHTTPError } from '../lib/utils/common';



export async function createPost(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    
    if (!user) {
      return next(createHTTPError(404, 'User not found.'));
    }


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