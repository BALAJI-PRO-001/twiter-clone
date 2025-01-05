import jwt from 'jsonwebtoken';
import { Response } from 'express';



export async function generateAccessTokenAndSetCookie(
  res: Response, 
  name: string,
  payload: string | Buffer | object,
  options: {
    httpOnly?: boolean,
    maxAge: number,
    sameSite: boolean,
    secure: boolean 
  }
) {
  const DEFAULT_MAX_AGE = 15 * 24 * 60 * 60 * 1000; 
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY as string, { expiresIn: '15d' }); res.cookie(name, accessToken, {
    httpOnly: options.httpOnly ? true : false,
    maxAge: options.maxAge ? options.maxAge : DEFAULT_MAX_AGE, 
    sameSite: options.sameSite ? options.sameSite : false,
    secure: options.secure ? options.secure : false
  }); 
}