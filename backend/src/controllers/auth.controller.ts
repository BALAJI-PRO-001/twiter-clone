import bcryptjs from 'bcryptjs';
import User from '../models/user.model';
import { createHTTPError } from '../lib/utils/common';
import { Request, Response, NextFunction } from 'express';
import { generateAccessTokenAndSetCookie } from '../lib/utils/generateAccessTokenAndSetCookie';
import { StatusCodes as STATUS_CODES } from 'http-status-codes';

import { 
  AUTHENTICATION_MESSAGES
} from '../constants/http/responseMessages';

import { 
  BAD_REQUEST_ERROR_MESSAGES, 
  NOT_FOUND_ERROR_MESSAGES,
  UNAUTHORIZED_ACCESS_ERROR_MESSAGES
} from '../constants/http/errorMessages';



export async function signup(
  req: Request,
  res: Response, 
  next: NextFunction
) {
  try {
    const { username, fullName, email, password } = req.body;
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser: any = new User({
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

      const { password:_, ...rest } = newUser._doc;

      res.status(STATUS_CODES.CREATED).json({
        success: true,
        message: AUTHENTICATION_MESSAGES.USER.SIGN_UP,
        data: {
          user: rest
        }
      });
      return;
    } 

    return next(createHTTPError(
      STATUS_CODES.BAD_REQUEST, 
      BAD_REQUEST_ERROR_MESSAGES.INVALID_USER_DATA
    ));
  } catch(err) {
    next(err);
  }
}



export async function login(
  req: Request, 
  res: Response, 
  next: NextFunction
) {
  try { 
    const { username, password } = req.body;
    const user: any = await User.findOne({ username: username });

    if (!user) {
      return next(createHTTPError(STATUS_CODES.NOT_FOUND, NOT_FOUND_ERROR_MESSAGES.USERNAME));
    }

    const isValidPassword = await bcryptjs.compare(password, user.password);
    if (!isValidPassword) {
      return next(createHTTPError(STATUS_CODES.UNAUTHORIZED, UNAUTHORIZED_ACCESS_ERROR_MESSAGES.PASSWORD));
    }

    generateAccessTokenAndSetCookie(res, 'user_access_token', { id: user.id }, {
      httpOnly: true,
      sameSite: true,
      secure: process.env.NODE_ENV !== 'development'
    });

    const { password:_, ...rest } = user._doc;
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: AUTHENTICATION_MESSAGES.USER.LOGGED_IN,
      data: {
        user: rest
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
)  {
  try {
    res.status(STATUS_CODES.OK)
       .clearCookie('user_access_token')
       .json({
          success: true,
          message: AUTHENTICATION_MESSAGES.USER.LOGGED_OUT
       });
  } catch(err) {
    next(err);
  }
}



export async function getAuthenticatedUser(
  req: Request,
  res: Response,
  next: NextFunction
) {  
  try {
    const user: any = await User.findById(req.verifiedUserId as string);
    if (!user) {
      return next(createHTTPError(STATUS_CODES.NOT_FOUND, NOT_FOUND_ERROR_MESSAGES.USER));
    }
  
    const { password:_, ...rest } = user._doc;
    res.status(200).json({
      success: true,
      message: AUTHENTICATION_MESSAGES.USER.AUTH_USER_INFO,
      data: {
        user: rest
      }
    });
  } catch(err) {
    next(err);
  }
}