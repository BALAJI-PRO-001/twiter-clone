import { Request } from "express";
import User from '../../models/user.model.js';
import { FormattedUserDataValidationError, ValidationResult } from '../../lib/types';
import { body, validationResult, Result, ValidationError } from 'express-validator';



function extractFormattedValidationError(validationResults: Result): FormattedUserDataValidationError {
  const errorMessages: Result<string> = validationResults.formatWith((err) => err.msg as string);
  const error = validationResults.array({ onlyFirstError: true })[0];

  return {
    field: error.path, 
    validationLocation: error.location,
    providedValue: error.value,
    errorMessages: errorMessages.array(),
  };
}



async function checkRequiredFiled(req: Request, fieldName: string): Promise<void> {
  await body(fieldName)
    .exists({ values: 'falsy' })
    .withMessage(`${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required, But provided value: ${req.body[fieldName]}`)
    .run(req);
}



export async function checkNewUserRequiredFields(req: Request): Promise<{ isValid: boolean, validationLocation?: string, errorMessages?: string[] }> {
  await checkRequiredFiled(req, 'username');
  await checkRequiredFiled(req, 'fullName');
  await checkRequiredFiled(req, 'email');
  await checkRequiredFiled(req, 'password');
  await checkRequiredFiled(req, 'followers')
  await checkRequiredFiled(req, 'following');
  await checkRequiredFiled(req, 'profileImg');
  await checkRequiredFiled(req, 'coverImg');
  await checkRequiredFiled(req, 'bio');
  await checkRequiredFiled(req, 'links');
  
  const results = validationResult(req).formatWith((err) => err.msg as string);
  if (!results.isEmpty()) {
    return { isValid: false, validationLocation: 'body', errorMessages: results.array() };
  }

  return { isValid: true };
}



export async function validateUsername(req: Request): Promise<FormattedUserDataValidationError | ValidationResult> {
  await body('username')
    .trim().escape()
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores.')
    .isLength({ min: 5 }).withMessage('Username must be at least 5 characters or long.')
    .run(req);

  const result = validationResult(req);
  if (!result.isEmpty()) {
    return extractFormattedValidationError(result);
  }

  const isUsernameAlreadyInUse = await User.findOne({ username: req.body.username });
  console.log(isUsernameAlreadyInUse, req.body.username);
  if (isUsernameAlreadyInUse) {
    return {
      field: 'username', 
      validationLocation: 'body',
      providedValue: req.body.username,
      errorMessages: ['Duplicate: Username is already used by another account.'],
    };
  }

  return { isValid: true, value: req.body.username };
}



export async function validateUserFullName(req: Request): Promise<FormattedUserDataValidationError | ValidationResult> {
  await body('fullName')
    .trim().escape()
    .isString().withMessage('User fullname must be string.')
    .isLength({ min: 5 }).withMessage('User fullname must be at least 5 characters or long.')
    .run(req);

  const result = validationResult(req);
  if (!result.isEmpty()) {
    return extractFormattedValidationError(result);
  } 

  return { isValid: true, value: req.body.fullName };
}



export async function validateEmail(req: Request): Promise<FormattedUserDataValidationError | ValidationResult> {
  await body('email')
    .trim().escape()
    .isEmail({ host_whitelist: ['gmail.com'] }).withMessage('Please provide valid email.')
    .run(req);

  const result = validationResult(req);
  if (!result.isEmpty()) {
    return extractFormattedValidationError(result);
  }

  const isEmailAlreadyInUse = await User.findOne({ email: req.body.email });
  if (isEmailAlreadyInUse) {
    return {
      field: 'email', 
      validationLocation: 'body',
      providedValue: req.body.email,
      errorMessages: ['Duplicate: Email is already used by another account.'],
    };
  }

  return { isValid: true, value: req.body.email };
}



export async function validatePassword(req: Request): Promise<FormattedUserDataValidationError | ValidationResult> {
  await body('password')
    .trim().escape()
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters or long.')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
    .withMessage('Password must contain at least one letter, one number, and one special character.')
    .custom((password, { req }) => {
      if (password === req.body.username || password === req.body.fullName) {
        throw new Error(`Password cannot be the same as username and fullname.`);
      }
      return true;
    }).run(req);

    const result = validationResult(req);
    if (!result.isEmpty()) {
      return extractFormattedValidationError(result);
    }

    return { isValid: true, value: req.body.password };
}



export async function validateFollowers(req: Request): Promise<FormattedUserDataValidationError | ValidationResult> {
  await body('followers')
    .isArray({ max: 0 }).withMessage('Followers field must be empty array.')
    .run(req);

  const result = validationResult(req);
  if (!result.isEmpty())  {
    return extractFormattedValidationError(result);
  }

  return { isValid: true, value: req.body.followers };
}


export async function validateFollowing(req: Request): Promise<FormattedUserDataValidationError | ValidationResult> {
  await body('following')
    .isArray({ max: 0 }).withMessage('Following field must be empty array.')
    .run(req);

  const result = validationResult(req);
  if (!result.isEmpty())  {
    return extractFormattedValidationError(result);
  }

  return { isValid: true, value: req.body.following };
}



export async function validateProfileImgURL(req: Request) {
  await body('profileImgURL')
    .trim().escape()
    .isURL()
    .withMessage("Invalid profile image URL.")
    .run(req);

  const result = validationResult(req);
  if (!result.isEmpty()) {
    return extractFormattedValidationError(result);
  }
}



export async function validateCoverImgURL(req: Request) {
  await body('coverImgURL')
    .trim().escape()
    .isURL()
    .withMessage("Invalid cover image URL.")
    .run(req);

  const result = validationResult(req);
  if (!result.isEmpty()) {
    return extractFormattedValidationError(result);
  }
}