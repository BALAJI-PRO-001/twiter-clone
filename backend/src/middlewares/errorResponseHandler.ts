import { Request, Response, NextFunction } from 'express';
import { HTTPError } from '../lib/types';

export default function errorResponseHandler(err: HTTPError, req: Request, res: Response, next: NextFunction): void {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error.';
  res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    message: message
  });
}