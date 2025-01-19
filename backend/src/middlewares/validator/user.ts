import { Request, Response, NextFunction } from 'express';
import User from '../../models/user.model';
import { createHTTPError } from '../../lib/utils/common';
import { body, validationResult, Result, } from 'express-validator';
import { StatusCodes as STATUS_CODES } from 'http-status-codes';
import { VALIDATION_TITLES } from '../../constants';

import {
  checkRequiredFiled,
  extractFormattedValidationError,
  validationErrorHandler,
  validateURL
} from './common';

import {
  FormattedDataValidationError,
  RequiredFieldsValidationResult,
  ValidationResult,
} from '../../lib/types';

import {
  BIO_VALIDATION_MESSAGES,
  EMAIL_VALIDATION_MESSAGES,
  EMPTY_UPDATE_FIELDS_MESSAGE,
  PASSWORD_VALIDATION_MESSAGES,
  REQUIRED_PASSWORD_FIELDS_MESSAGE,
  USERNAME_VALIDATION_MESSAGES,
  USER_FULLNAME_VALIDATION_MESSAGES
} from '../../constants/validationMessages';



async function checkNewUserRequiredFields(
  req: Request
): Promise<RequiredFieldsValidationResult> {

  await checkRequiredFiled(req, 'username');
  await checkRequiredFiled(req, 'fullName');
  await checkRequiredFiled(req, 'email');
  await checkRequiredFiled(req, 'password');

  const results = validationResult(req).formatWith((err) => err.msg as string);
  if (!results.isEmpty()) {
    return {
      location: 'body',
      messages: results.array()
    };
  }

  return { isValid: true };
}



async function checkUserCredentials(
  req: Request
): Promise<RequiredFieldsValidationResult> {

  await checkRequiredFiled(req, 'username');
  await checkRequiredFiled(req, 'password');

  const results: Result<string> = validationResult(req).formatWith((err) => err.msg as string);
  if (!results.isEmpty()) {
    return {
      location: 'body',
      messages: results.array()
    };
  }

  return { isValid: true };
}



async function validateUsername(
  req: Request,
  dbCheck: boolean = false
): Promise<FormattedDataValidationError | ValidationResult> {

  await body('username')
    .trim().escape()
    .isLength({ min: 5 })
    .withMessage(USERNAME_VALIDATION_MESSAGES.REQUIRED_LENGTH)
    .bail()
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage(USERNAME_VALIDATION_MESSAGES.REQUIRED_CHARACTERS)
    .bail()
    .toLowerCase()
    .run(req);
    
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return extractFormattedValidationError(result);
  }

  if (dbCheck) {
    const isUsernameAlreadyInUse = await User.findOne({ username: req.body.username });
    if (isUsernameAlreadyInUse) {
      return {
        field: 'username',
        location: 'body',
        providedValue: req.body.username,
        message: USERNAME_VALIDATION_MESSAGES.DUPLICATE_USER_NAME,
      };
    }
  }

  return { isValid: true, value: req.body.username };
}



async function validateUserFullName(
  req: Request
): Promise<FormattedDataValidationError | ValidationResult> {

  await body('fullName')
    .trim().escape()
    .isLength({ min: 5 })
    .withMessage(USER_FULLNAME_VALIDATION_MESSAGES.REQUIRED_LENGTH)
    .run(req);

  const result = validationResult(req);
  if (!result.isEmpty()) {
    return extractFormattedValidationError(result);
  }

  return { isValid: true, value: req.body.fullName };
}



async function validateEmail(
  req: Request,
  dbCheck: boolean = false
): Promise<FormattedDataValidationError | ValidationResult> {

  await body('email')
    .trim()
    .escape()
    .isEmail({ host_whitelist: ['gmail.com'] })
    .withMessage(EMAIL_VALIDATION_MESSAGES.INVALID_EMAIL)
    .normalizeEmail({ all_lowercase: true })
    .run(req);

  const result = validationResult(req);
  if (!result.isEmpty()) {
    return extractFormattedValidationError(result);
  }

  if (dbCheck) {
    const isEmailAlreadyInUse = await User.findOne({ email: req.body.email });

    if (isEmailAlreadyInUse) {
      return {
        field: 'email',
        location: 'body',
        providedValue: req.body.email,
        message: EMAIL_VALIDATION_MESSAGES.DUPLICATE_EMAIL
      };
    }
  }

  return { isValid: true, value: req.body.email };
}



async function validatePassword(
  req: Request, fieldName: string
): Promise<FormattedDataValidationError | ValidationResult> {

  const fieldForMessage = fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
  const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  await body(fieldName)
    .trim()
    .escape()
    .isLength({ min: 8 })
    .withMessage(`${fieldForMessage} ${PASSWORD_VALIDATION_MESSAGES.REQUIRED_LENGTH}`)
    .bail()
    .matches(PASSWORD_REGEX)
    .withMessage(`${fieldForMessage} ${PASSWORD_VALIDATION_MESSAGES.REQUIRED_CHARACTERS}`)
    .bail()
    .custom((password, { req }) => {
      if (password === req.body.username || password === req.body.fullName) {
        throw new Error(`${fieldForMessage} ${PASSWORD_VALIDATION_MESSAGES.INVALID_PASSWORD}`);
      }
      return true;
    }).run(req);

  let result = validationResult(req);
  if (!result.isEmpty()) {
    return extractFormattedValidationError(result);
  }

  return { isValid: true, value: req.body.password };
}



async function validateBio(
  req: Request
): Promise<FormattedDataValidationError | ValidationResult> {

  await body('bio')
    .trim()
    .escape()
    .isString()
    .withMessage(BIO_VALIDATION_MESSAGES.INVALID_BIO)
    .run(req);

  const result = validationResult(req);
  if (!result.isEmpty()) {
    return extractFormattedValidationError(result);
  }

  return { isValid: true, value: req.body.bio };
}



export async function validateNewUserFields(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {

  let result: any = await checkNewUserRequiredFields(req);
  if (!result.isValid) {
    return validationErrorHandler(
      res, 
      STATUS_CODES.BAD_REQUEST, 
      VALIDATION_TITLES.REQUIRED_FIELDS,
      result
    );
  }

  result = await validateUsername(req, true);
  if (!result.isValid) {
    const statusCode = result.message.includes('Duplicate')
      ? STATUS_CODES.CONFLICT
      : STATUS_CODES.BAD_REQUEST;

    return validationErrorHandler(
      res, 
      statusCode, 
      VALIDATION_TITLES.DATA_VALIDATION,
      result
    );
  }

  result = await validateUserFullName(req);
  if (!result.isValid) {
    return validationErrorHandler(
      res, 
      STATUS_CODES.BAD_REQUEST,
      VALIDATION_TITLES.DATA_VALIDATION, 
      result
    );
  }

  result = await validateEmail(req, true);
  if (!result.isValid) {
    const statusCode = result.message.includes('Duplicate')
      ? STATUS_CODES.CONFLICT
      : STATUS_CODES.BAD_REQUEST;

    return validationErrorHandler(
      res, 
      statusCode, 
      VALIDATION_TITLES.DATA_VALIDATION,
      result
    );
  }

  result = await validatePassword(req, 'password');
  if (!result.isValid) {
    return validationErrorHandler(
      res, 
      STATUS_CODES.BAD_REQUEST, 
      VALIDATION_TITLES.DATA_VALIDATION,
      result  
    );
  }

  next();
}



export async function validateUserCredentials(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {

  let result = await checkUserCredentials(req);
  if (!result.isValid) {
    return validationErrorHandler(
      res, 
      STATUS_CODES.BAD_REQUEST,
      VALIDATION_TITLES.REQUIRED_FIELDS,
      result
    );
  }

  result = await validateUsername(req);
  if (!result.isValid) {
    return validationErrorHandler(
      res, 
      STATUS_CODES.BAD_REQUEST,
      VALIDATION_TITLES.DATA_VALIDATION,
      result
    );
  }

  result = await validatePassword(req, 'password');
  if (!result.isValid) {
    return validationErrorHandler(
      res, 
      STATUS_CODES.BAD_REQUEST, 
      VALIDATION_TITLES.DATA_VALIDATION,
      result
    );
  }

  next();
}



export async function validateUserUpdateFields(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {

  if (Object.keys(req.body).length <= 0) {
    return validationErrorHandler(
      res, 
      STATUS_CODES.BAD_REQUEST, 
      VALIDATION_TITLES.REQUIRED_FIELDS,
      {
        location: 'body',
        messages: [ EMPTY_UPDATE_FIELDS_MESSAGE ]
      }
    );
  }

  if (req.body.username) {
    const result: any = await validateUsername(req, true);
    if (!result.isValid) {
      const statusCode = result.errorMessages[0].includes('Duplicate')
        ? STATUS_CODES.CONFLICT
        : STATUS_CODES.BAD_REQUEST;

      return validationErrorHandler(
        res, 
        statusCode, 
        VALIDATION_TITLES.DATA_VALIDATION,
        result
      );
    }
  }

  if (req.body.fullName) {
    const result: any = await validateUserFullName(req);
    if (!result.isValid) {
      return validationErrorHandler(
        res, 
        STATUS_CODES.BAD_REQUEST, 
        VALIDATION_TITLES.DATA_VALIDATION,
        result
      );
    }
  }

  if (req.body.email) {
    const result: any = await validateEmail(req, true);
    if (!result.isValid) {
      const statusCode = result.errorMessages[0].includes('Duplicate')
        ? STATUS_CODES.CONFLICT
        : STATUS_CODES.BAD_REQUEST;

      return validationErrorHandler(
        res, 
        statusCode, 
        VALIDATION_TITLES.DATA_VALIDATION,
        result
      );
    }
  }

  if (
    req.body.newPassword && !req.body.currentPassword ||
    req.body.currentPassword && !req.body.newPassword
  ) {
    return next(createHTTPError(STATUS_CODES.BAD_REQUEST, REQUIRED_PASSWORD_FIELDS_MESSAGE));
  }

  if (req.body.newPassword && req.body.currentPassword) {
    let result: any = await validatePassword(req, 'newPassword');
    if (!result.isValid) {
      return validationErrorHandler(
        res, 
        STATUS_CODES.BAD_REQUEST, 
        VALIDATION_TITLES.DATA_VALIDATION,
        result
      );
    }

    result = await validatePassword(req, 'currentPassword');
    if (!result.isValid) {
      return validationErrorHandler(
        res, 
        STATUS_CODES.BAD_REQUEST, 
        VALIDATION_TITLES.DATA_VALIDATION,
        result
      );
    }
  }


  if (req.body.profileImgURL) {
    const result: any = await validateURL(req, 'profileImgURL');
    if (!result.isValid) {
      return validationErrorHandler(
        res, 
        STATUS_CODES.BAD_REQUEST, 
        VALIDATION_TITLES.DATA_VALIDATION,
        result  
      );
    }
  }

  if (req.body.coverImgURL) {
    const result: any = await validateURL(req, 'coverImgURL');
    if (!result.isValid) {
      return validationErrorHandler(
        res, 
        STATUS_CODES.BAD_REQUEST, 
        VALIDATION_TITLES.DATA_VALIDATION,
        result
      );
    }
  }

  if (req.body.bio) {
    const result: any = await validateBio(req);
    if (!result.isValid) {
      return validationErrorHandler(
        res, 
        STATUS_CODES.BAD_REQUEST, 
        VALIDATION_TITLES.DATA_VALIDATION,
        result
       );
    }
  }


  if (req.body.links) {
    const result: any = await validateURL(req, 'link');
    if (!result.isValid) {
      return validationErrorHandler(
        res, 
        STATUS_CODES.BAD_REQUEST, 
        VALIDATION_TITLES.DATA_VALIDATION,
        result
      );
    }
  }

  next();
}
