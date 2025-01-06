import bcryptjs from 'bcryptjs';
import User from '../models/user.model';
import { createHTTPError, sanitizeUserAndFormat } from '../lib/utils/common';
import { Request, Response, NextFunction } from 'express';
import { generateAccessTokenAndSetCookie } from '../lib/utils/generateAccessTokenAndSetCookie';



export async function signup(
  req: Request,
  res: Response, 
  next: NextFunction
): Promise<void> {
  try {
    const { username, fullName, email, password } = req.body;
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      username: username,
      fullName: fullName,
      email: email,
      password: hashedPassword,
    });

    if (newUser) {
      generateAccessTokenAndSetCookie(res, 'user_access_token', { id: newUser.id }, {
        httpOnly: true,
        sameSite: true,
        secure: process.env.NODE_ENV !== 'development'
      });
      await newUser.save();

      res.status(201).json({
        success: true,
        statusCode: 201,
        data: {
          user: sanitizeUserAndFormat(newUser)
        }
      });
      return;
    } 
    return next(createHTTPError(400, 'Invalid user data.'));
  } catch(err) {
    next(err);
  }
}



export async function login(
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> {
  try { 
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });

    if (!user) {
      return next(createHTTPError(404, 'Not Found: Invalid username.'));
    }

    const isValidPassword = await bcryptjs.compare(password, user.password);
    if (!isValidPassword) {
      return next(createHTTPError(401, 'Unauthorized: Invalid password.'));
    }

    generateAccessTokenAndSetCookie(res, 'user_access_token', { id: user.id }, {
      httpOnly: true,
      sameSite: true,
      secure: process.env.NODE_ENV !== 'development'
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        user: sanitizeUserAndFormat(user)
      }
    });
  } catch(err) {
    next(err);
  }
}


export async function logout(
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> {
  try {
    res.status(200)
       .clearCookie('user_access_token')
       .json({
          success: true,
          statusCode: 200,
          message: "Logged out successfully."
       });
  } catch(err) {
    next(err);
  }
}



export async function getAuthenticatedUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {  
  try {
    const user = await User.findById(req.verifiedUserId as string);
    if (!user) {
      return next(createHTTPError(404, 'User not found.'));
    }
  
    res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        user: sanitizeUserAndFormat(user)
      }
    });
  } catch(err) {
    next(err);
  }
}