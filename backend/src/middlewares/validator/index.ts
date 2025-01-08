import { Request, Response, NextFunction } from 'express';
import {
  validateNewUserFields,
  validateUserCredentials,
  validateUserUpdateFields,
} from './user';
import { body, param, validationResult } from 'express-validator';
import { createHTTPError } from '../../lib/utils/common';
import { StatusCodes as STATUS_CODES } from 'http-status-codes';
import { BAD_REQUEST_ERROR_MESSAGES } from '../../constants/httpErrorMessages';



async function validateId(
  fields: string | string[],
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> {
  await param('id')
    .optional()
    .isMongoId()
    .run(req);

  let result = validationResult(req);
  if (!result.isEmpty()) {
    return next(createHTTPError(
      STATUS_CODES.BAD_REQUEST,
      BAD_REQUEST_ERROR_MESSAGES.INVALID_MONGODB_ID
    ));
  }

  await body(fields)
    .optional()
    .isMongoId()
    .run(req);

  result = validationResult(req);
  if (!result.isEmpty()) {
    return next(createHTTPError(
      STATUS_CODES.BAD_REQUEST,
      BAD_REQUEST_ERROR_MESSAGES.INVALID_MONGODB_ID
    ));
  }

  next();
}



export {
  validateId,
  validateNewUserFields,
  validateUserCredentials,
  validateUserUpdateFields
};