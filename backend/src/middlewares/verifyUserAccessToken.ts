import { Request, Response, NextFunction } from 'express';
import { createHTTPError } from '../lib/utils/common';
import jwt from 'jsonwebtoken';


export async function verifyUserAccessToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const accessToken = req.cookies.user_access_token;
  
    if (!accessToken) {
      return next(createHTTPError(401, 'Unauthorized: Access token does not exist.'));
    }
  
    jwt.verify(
      accessToken, 
      process.env.JWT_SECRET_KEY as string, 
      (err: jwt.VerifyErrors | null, decoded: jwt.JwtPayload | string | undefined) => {
        if (err) {
          return next(createHTTPError(403, 'Forbidden: Invalid access token.'));
        }

        if (decoded && typeof decoded === 'object' && 'id' in decoded) {
          req.verifiedUserId = decoded.id as string;
          return next();
        } else {
          return next(createHTTPError(400, 'Bad Request: Invalid token payload.'));
        }
      }
    );
  } catch(err) {
    next(err);
  }
}