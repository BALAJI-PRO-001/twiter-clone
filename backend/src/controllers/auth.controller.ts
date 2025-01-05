import bcryptjs from 'bcryptjs';
import User from '../models/user.model';
import { createHTTPError } from '../lib/utils/common';
import { Request, Response, NextFunction } from 'express';
import { generateAccessTokenAndSetCookie } from '../lib/utils/generateAccessTokenAndSetCookie';



export async function signup(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // const { username, fullName, email, password } = req.body;
    // const salt = await bcryptjs.genSalt(10);
    // const hashedPassword = await bcryptjs.hash(password, salt);

    // const newUser = new User({
    //   username: username,
    //   fullName: fullName,
    //   email: email,
    //   password: hashedPassword,
    // });

    // if (newUser) {
    //   generateAccessTokenAndSetCookie(res, { id: newUser.id });
    //   await newUser.save();

    //   res.status(201).json({
    //     success: true,
    //     statusCode: 201,
    //     data: {
    //       user: {
    //         id: newUser._id,
    //         username: newUser.username,
    //         fullName: newUser.fullName,
    //         email: newUser.email,
    //         followers: newUser.followers,
    //         following: newUser.following,
    //         profileImgURL: newUser.profileImgURL,
    //         coverImgURL: newUser.coverImgURL,
    //         bio: newUser.bio,
    //         links: newUser.links
    //       }
    //     }
    //   });
    //   return;
    // } 
    // return next(createHTTPError(400, 'Invalid user data.'));
  } catch(err) {
    console.log('AuthController -> Signup: ', err);
    next(err);
  }
}


export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { 
    const { email, password } = req.body();
  } catch(err) {
    next(err);
  }
}


export async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  
}