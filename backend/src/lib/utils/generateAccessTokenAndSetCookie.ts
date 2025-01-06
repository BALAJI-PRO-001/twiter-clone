import jwt from 'jsonwebtoken';
import { Response } from 'express';


export function generateAccessTokenAndSetCookie(
  res: Response, 
  name: string,
  payload: object,
  options: {
    httpOnly?: boolean,
    maxAge?: number,
    sameSite?: boolean,
    secure?: boolean 
  }
): void {
  const DEFAULT_MAX_AGE = 15 * 24 * 60 * 60 * 1000; 
  const EXPIRES_IN: any = options.maxAge 
    ? options.maxAge / 1000 
    : DEFAULT_MAX_AGE / 1000;

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY as string, { 
    expiresIn: EXPIRES_IN 
  });

  res.cookie(name, accessToken, {
    httpOnly: options.httpOnly ? true : false,
    maxAge: options.maxAge ? options.maxAge : DEFAULT_MAX_AGE, 
    sameSite: options.sameSite ? options.sameSite : false,
    secure: options.secure ? options.secure : false
  }); 
}