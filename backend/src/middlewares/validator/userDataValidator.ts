import { Request, Response, NextFunction } from "express";
import User from '../../models/user.model.js';
import {
  body,
  validationResult,
  Result,
} from 'express-validator';
import {
  FormattedUserDataValidationError,
  RequiredFieldsValidationResult,
  ValidationResult,
} from '../../lib/types';
import { createHTTPError } from "../../lib/utils/common.js";



function extractFormattedValidationError(
  validationResult: Result
): FormattedUserDataValidationError {

  const errorMessages: Result<string> = validationResult.formatWith((err) => err.msg as string);
  const error = validationResult.array({ onlyFirstError: true })[0];
  return {
    isValid: false,
    validationLocation: error.location,
    providedValue: error.value,
    errorMessages: errorMessages.array(),
  };
}



async function checkRequiredFiled(
  req: Request, 
  fieldName: string
): Promise<void> {

  await body(fieldName)
    .exists({ values: 'falsy' })
    .withMessage(`${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required.`)
    .run(req);
}



function validationResultHandler(
  res: Response,
  statusCode: number,
  validationResults: { [key: string]: any }
): void {

  res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    validationResults: validationResults
  });
}




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
): Promise<FormattedUserDataValidationError | ValidationResult> {

  await body('username')
    .trim().escape()
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores.')
    .isLength({ min: 5 }).withMessage('Username must be at least 5 characters or long.')
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
        errorMessages: ['Duplicate: Username is already used by another account.'],
      };
    }
  }

  return { isValid: true, value: req.body.username };
}



async function validateUserFullName(
  req: Request
): Promise<FormattedUserDataValidationError | ValidationResult> {

  await body('fullName')
    .trim().escape()
    .isLength({ min: 5 })
    .withMessage('User fullname must be at least 5 characters or long.')
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
): Promise<FormattedUserDataValidationError | ValidationResult> {

  await body('email')
    .trim()
    .escape()
    .isEmail({ host_whitelist: ['gmail.com'] }).withMessage('Please provide valid email.')
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
        errorMessages: [ 'Duplicate: Email is already used by another account.' ]
      };
    }
  }

  return { isValid: true, value: req.body.email };
}



async function validatePassword(
  req: Request, fieldName: string
): Promise<FormattedUserDataValidationError | ValidationResult> {

  const fieldForMessage = fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
  const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  await body(fieldName)
  .trim()
  .escape()
  .isLength({ min: 8 }).withMessage(`${fieldForMessage} must be at least 8 characters or long.`)
  .matches(PASSWORD_REGEX)
  .withMessage(`${fieldForMessage} must be one character: letter, number, or special character.`)
  .custom((password, { req }) => {
    if (password === req.body.username || password === req.body.fullName) {
      throw new Error(`${fieldForMessage} cannot be the same as username and fullname.`);
    }
    return true;
  }).run(req);

  let result = validationResult(req);
  if (!result.isEmpty()) {
    return extractFormattedValidationError(result);
  }

  return { isValid: true, value: req.body.password };
}



async function validateURL(
  req: Request,
  filedName: string
): Promise<FormattedUserDataValidationError | ValidationResult> {
  await body(filedName)
    .trim()
    .isURL()
    .withMessage(`Invalid ${filedName}.`)
    .run(req);

  const result = validationResult(req);
  if (!result.isEmpty()) {
    return extractFormattedValidationError(result);
  }

  return { isValid: true, value: req.body.profileImgURL };
}



async function validateBio(
  req: Request
): Promise<FormattedUserDataValidationError | ValidationResult> {

  await body('bio')
    .trim()
    .escape()
    .isString().withMessage('Bio must be string.')
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
    return validationResultHandler(res, 400, { 
      requiredFields: result
    });
  }

  result = await validateUsername(req, true);
  if (!result.isValid && result.errorMessages) {
    const statusCode = result.errorMessages[0].includes('Duplicate') ? 409 : 400;
    return validationResultHandler(res, statusCode, { username: result });
  }

  result = await validateUserFullName(req);
  if (!result.isValid) {
    return validationResultHandler(res, 400, { fullName: result });
  }

  result = await validateEmail(req, true);
  if (!result.isValid && result.errorMessages) {
    const statusCode = result.errorMessages[0].includes('Duplicate') ? 409 : 400;
    return validationResultHandler(res, statusCode, { email: result });
  }

  result = await validatePassword(req, 'password');
  if (!result.isValid) {
    return validationResultHandler(res, 400, { password: result });
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
    return validationResultHandler(res, 400, {
      requiredFields: result
    });
  }

  result = await validateUsername(req);
  if (!result.isValid) {
    return validationResultHandler(res, 400, { result });
  }

  result = await validatePassword(req, 'password');
  if (!result.isValid) {
    return validationResultHandler(res, 400, { password: result });
  }

  next();
}



export async function validateUserUpdateFields(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {

  if (Object.keys(req.body).length <= 0) {
    return validationResultHandler(res, 400, {
      body: {
        isValid: false,
        validationLocation: 'body',
        providedValue: req.body,
        errorMessages: [ 'No fields provided for update.' ]
      }
    });
  }

  if (req.body.username) {
    const result: any = await validateUsername(req, true);
    if (!result.isValid) {
      const statusCode = result.errorMessages[0].includes('Duplicate') ? 409 : 400;
      return validationResultHandler(res, statusCode, {
        username: result
      });
    }
  }
  
  if (req.body.fullName) {
    const result: any = await validateUserFullName(req); 
    if (!result.isValid) {
      return validationResultHandler(res, 400, {
        fullName: result
      });
    }
  }

  if (req.body.email) {
    const result: any = await validateEmail(req, true);
    if (!result.isValid) {
      const statusCode = result.errorMessages[0].includes('Duplicate') ? 409 : 400;
      return validationResultHandler(res, statusCode, {
        email: result
      });
    }
  }

  if (
    req.body.newPassword && !req.body.currentPassword ||
    req.body.currentPassword && !req.body.newPassword
  ) {
    return next(createHTTPError(400, 'Both current password and new password are required.'));
  }
  
  if (req.body.newPassword && req.body.currentPassword) {
    let result = await validatePassword(req, 'newPassword');
    if (!result.isValid) {
      return validationResultHandler(res, 400, {
        newPassword: result
      });
    }

    result = await validatePassword(req, 'currentPassword');
    if (!result.isValid) {
      return validationResultHandler(res, 400, {
        currentPassword: result
      });
    }
  }


  if (req.body.profileImgURL) {
    const result: any = await validateURL(req, 'profileImgURL');
    if (!result.isValid) {
      return validationResultHandler(res, 400, {
        profileImgURL: result
      });
    }
  }

  if (req.body.coverImgURL) {
    const result: any = await validateURL(req, 'coverImgURL');
    if (!result.isValid) {
      return validationResultHandler(res, 400, {
        coverImgURL: result
      });
    }
  }

  if (req.body.bio) {
    const result = await validateBio(req);
    if (!result.isValid) {
      return validationResultHandler(res, 400, {
        bio: result
      });
    }
  }


  if (req.body.links) {
    const result = await validateURL(req, 'link');
    if (!result.isValid) {
      return validationResultHandler(res, 400, {
        links: result
      });
    }
  }

  next();
}