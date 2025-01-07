import { Request, Response, NextFunction } from 'express';
import {
  validateNewUserFields,
  validateUserCredentials,
  validateUserUpdateFields,
} from './userDataValidator';
import { body, param, validationResult } from 'express-validator';
import { createHTTPError } from '../../lib/utils/common';


async function validateId(
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
    return next(createHTTPError(400, 'Invalid mongodb id in url param.'));
  }

  await body(['id', 'followerId'])
    .optional()
    .isMongoId()
    .run(req);

  result = validationResult(req);
  if (!result.isEmpty()) {
    return next(createHTTPError(400, 'Invalid mongodb id in body.'));
  }

  next();
}



export {
  validateId,
  validateNewUserFields,
  validateUserCredentials,
  validateUserUpdateFields
};