import { body, validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import { extractFormattedValidationError, validateURL, validationResultHandler } from './common';
import { StatusCodes as STATUS_CODES, StatusCodes } from 'http-status-codes';
import { 
  POST_TEXT_VALIDATION_MESSAGE,
  POST_MISSING_FIELDS_MESSAGE
} from '../../constants/validationMessages';

import { 
  FormattedDataValidationError, 
  RequiredFieldsValidationResult, 
  ValidationResult
} from '../../lib/types';



async function checkRequiredNewPostFields(
  req: Request,
): Promise<RequiredFieldsValidationResult> {
  
  if (!req.body.text && !req.body.imgURL) {
    return {
      isValid: false,
      validationLocation: 'body',
      errorMessages: [ POST_MISSING_FIELDS_MESSAGE ]
    }; 
  }

  return { isValid: true };
}



async function validateText(
  req: Request
): Promise<FormattedDataValidationError | ValidationResult> {
  await body('text')
    .trim()
    .escape()
    .isLength({ min: 5 })
    .withMessage(POST_TEXT_VALIDATION_MESSAGE)
    .run(req);

  const result = validationResult(req);
  if (!result.isEmpty()) {
    return extractFormattedValidationError(result);
  }

  return { isValid: true, value: req.body.text };
}



export async function validateNewPostData(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {

  let result = await checkRequiredNewPostFields(req);
  if (!result.isValid) {
    return validationResultHandler(res, 400, {
      requiredFields: result
    });
  }


  if (req.body.text) {
    result = await validateText(req);
    if (!result.isValid) {
      return validationResultHandler(res, STATUS_CODES.BAD_REQUEST, {
        text: result
      });
    }
  }

  if (req.body.imgURL) {
    result = await validateURL(req, 'imgURL');
    if (!result.isValid) {
      return validationResultHandler(res, STATUS_CODES.BAD_REQUEST, {
        imgURL: result
      })
    }
  }

  next();
}
