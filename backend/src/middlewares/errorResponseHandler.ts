import { Request, Response, NextFunction } from 'express';
import { HTTPError } from '../lib/types';
import { StatusCodes as STATUS_CODES, getReasonPhrase } from 'http-status-codes';



export default function errorResponseHandler(
  err: HTTPError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const statusCode = err.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR;
  const message = err.message || getReasonPhrase(STATUS_CODES.INTERNAL_SERVER_ERROR);
  res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    message: message
  });
}