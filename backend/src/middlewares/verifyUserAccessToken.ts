import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { createHTTPError } from '../lib/utils/common';
import { StatusCodes as STATUS_CODES } from 'http-status-codes';
import { 
  UNAUTHORIZED_ACCESS_ERROR_MESSAGES,
  BAD_REQUEST_ERROR_MESSAGES
} from '../constants/http/errorMessages';



export default async function verifyUserAccessToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const accessToken = req.cookies.user_access_token;
  
    if (!accessToken) {
      return next(createHTTPError(
        STATUS_CODES.UNAUTHORIZED,
        UNAUTHORIZED_ACCESS_ERROR_MESSAGES.COOKIE.COOKIE_NOT_FOUND
      ));
    }
  
    jwt.verify(
      accessToken, 
      process.env.JWT_SECRET_KEY as string, 
      (err: jwt.VerifyErrors | null, decoded: jwt.JwtPayload | string | undefined) => {
        if (err) {
          return next(createHTTPError(
            STATUS_CODES.FORBIDDEN,
            UNAUTHORIZED_ACCESS_ERROR_MESSAGES.COOKIE.INVALID_COOKIE
          ));
        }

        if (decoded && typeof decoded === 'object' && 'id' in decoded) {
          req.verifiedUserId = decoded.id as string;
          return next();
        } else {
          return next(createHTTPError(
            STATUS_CODES.BAD_REQUEST,
            BAD_REQUEST_ERROR_MESSAGES.INVALID_PAYLOAD
          ));
        }
      }
    );
  } catch(err) {
    next(err);
  }
}