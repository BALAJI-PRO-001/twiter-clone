import { Request, Response, NextFunction } from 'express';
import User from '../../models/user.model';
import { createHTTPError } from '../../lib/utils/common';
import { body, validationResult, Result, } from 'express-validator';
import { StatusCodes as STATUS_CODES } from 'http-status-codes';

import {
  checkRequiredFiled,
  extractFormattedValidationError,
  validationResultHandler,
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
      isValid: false,
      validationLocation: 'body',
      errorMessages: results.array()
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
      isValid: false,
      validationLocation: 'body',
      errorMessages: results.array()
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
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage(USERNAME_VALIDATION_MESSAGES.REQUIRED_CHARACTERS)
    .isLength({ min: 5 })
    .withMessage(USERNAME_VALIDATION_MESSAGES.REQUIRED_LENGTH)
    .run(req);

  const result = validationResult(req);
  if (!result.isEmpty()) {
    return extractFormattedValidationError(result);
  }

  if (dbCheck) {
    const isUsernameAlreadyInUse = await User.findOne({ username: req.body.username });
    if (isUsernameAlreadyInUse) {
      return {
        isValid: false,
        validationLocation: 'body',
        providedValue: req.body.username,
        errorMessages: [USERNAME_VALIDATION_MESSAGES.DUPLICATE_USER_NAME],
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
    .run(req);

  const result = validationResult(req);
  if (!result.isEmpty()) {
    return extractFormattedValidationError(result);
  }

  if (dbCheck) {
    const isEmailAlreadyInUse = await User.findOne({ email: req.body.email });

    if (isEmailAlreadyInUse) {
      return {
        isValid: false,
        validationLocation: 'body',
        providedValue: req.body.email,
        errorMessages: []
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
    .matches(PASSWORD_REGEX)
    .withMessage(`${fieldForMessage} ${PASSWORD_VALIDATION_MESSAGES.REQUIRED_CHARACTERS}`)
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

  let result = await checkNewUserRequiredFields(req);
  if (!result.isValid) {
    return validationResultHandler(res, STATUS_CODES.BAD_REQUEST, {
      requiredFields: result
    });
  }

  result = await validateUsername(req, true);
  if (!result.isValid && result.errorMessages) {
    const statusCode = result.errorMessages[0].includes('Duplicate')
      ? STATUS_CODES.CONFLICT
      : STATUS_CODES.BAD_REQUEST;

    return validationResultHandler(res, statusCode, { username: result });
  }

  result = await validateUserFullName(req);
  if (!result.isValid) {
    return validationResultHandler(res, STATUS_CODES.BAD_REQUEST, { fullName: result });
  }

  result = await validateEmail(req, true);
  if (!result.isValid && result.errorMessages) {
    const statusCode = result.errorMessages[0].includes('Duplicate')
      ? STATUS_CODES.CONFLICT
      : STATUS_CODES.BAD_REQUEST;

    return validationResultHandler(res, statusCode, { email: result });
  }

  result = await validatePassword(req, 'password');
  if (!result.isValid) {
    return validationResultHandler(res, STATUS_CODES.BAD_REQUEST, { password: result });
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
    return validationResultHandler(res, STATUS_CODES.BAD_REQUEST, {
      requiredFields: result
    });
  }

  result = await validateUsername(req);
  if (!result.isValid) {
    return validationResultHandler(res, STATUS_CODES.BAD_REQUEST, { result });
  }

  result = await validatePassword(req, 'password');
  if (!result.isValid) {
    return validationResultHandler(res, STATUS_CODES.BAD_REQUEST, { password: result });
  }

  next();
}



export async function validateUserUpdateFields(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {

  if (Object.keys(req.body).length <= 0) {
    return validationResultHandler(res, STATUS_CODES.BAD_REQUEST, {
      body: {
        isValid: false,
        validationLocation: 'body',
        providedValue: req.body,
        errorMessages: [EMPTY_UPDATE_FIELDS_MESSAGE]
      }
    });
  }

  if (req.body.username) {
    const result: any = await validateUsername(req, true);
    if (!result.isValid) {
      const statusCode = result.errorMessages[0].includes('Duplicate')
        ? STATUS_CODES.CONFLICT
        : STATUS_CODES.BAD_REQUEST;

      return validationResultHandler(res, statusCode, {
        username: result
      });
    }
  }

  if (req.body.fullName) {
    const result: any = await validateUserFullName(req);
    if (!result.isValid) {
      return validationResultHandler(res, STATUS_CODES.BAD_REQUEST, {
        fullName: result
      });
    }
  }

  if (req.body.email) {
    const result: any = await validateEmail(req, true);
    if (!result.isValid) {
      const statusCode = result.errorMessages[0].includes('Duplicate')
        ? STATUS_CODES.CONFLICT
        : STATUS_CODES.BAD_REQUEST;

      return validationResultHandler(res, statusCode, {
        email: result
      });
    }
  }

  if (
    req.body.newPassword && !req.body.currentPassword ||
    req.body.currentPassword && !req.body.newPassword
  ) {
    return next(createHTTPError(STATUS_CODES.BAD_REQUEST, REQUIRED_PASSWORD_FIELDS_MESSAGE));
  }

  if (req.body.newPassword && req.body.currentPassword) {
    let result = await validatePassword(req, 'newPassword');
    if (!result.isValid) {
      return validationResultHandler(res, STATUS_CODES.BAD_REQUEST, {
        newPassword: result
      });
    }

    result = await validatePassword(req, 'currentPassword');
    if (!result.isValid) {
      return validationResultHandler(res, STATUS_CODES.BAD_REQUEST, {
        currentPassword: result
      });
    }
  }


  if (req.body.profileImgURL) {
    const result: any = await validateURL(req, 'profileImgURL');
    if (!result.isValid) {
      return validationResultHandler(res, STATUS_CODES.BAD_REQUEST, {
        profileImgURL: result
      });
    }
  }

  if (req.body.coverImgURL) {
    const result: any = await validateURL(req, 'coverImgURL');
    if (!result.isValid) {
      return validationResultHandler(res, STATUS_CODES.BAD_REQUEST, {
        coverImgURL: result
      });
    }
  }

  if (req.body.bio) {
    const result = await validateBio(req);
    if (!result.isValid) {
      return validationResultHandler(res, STATUS_CODES.BAD_REQUEST, {
        bio: result
      });
    }
  }


  if (req.body.links) {
    const result = await validateURL(req, 'link');
    if (!result.isValid) {
      return validationResultHandler(res, STATUS_CODES.BAD_REQUEST, {
        links: result
      });
    }
  }

  next();
}
