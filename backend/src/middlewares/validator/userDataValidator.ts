import { Request } from "express";
import { FormattedUserDataValidationError } from '../../lib/types';
import { body, validationResult, Result } from 'express-validator';


function extractFormattedValidationError(validationResults: Result): FormattedUserDataValidationError {
  const errorMessages: Result<string> = validationResults.formatWith((err) => err.msg as string);
  const error = validationResults.array({ onlyFirstError: true })[0];

  return {
    isValid: false,
    field: error.param, 
    validationLocation: error.location,
    providedValue: error.value,
    errorMessages: errorMessages.array(),
  };
}



export async function validateUsername(req: Request) {
  body('username')
    .isString().withMessage('Username must be string.')
    .isLength({ min: 5 }).withMessage('Username must be at lest 5 characters.')
    .run(req);

  const validationResults = validationResult(req);
  if (!validationResults.isEmpty()) {
    const error: any = extractFormattedValidationError(validationResults);
    error.exampleValue = 'user_!@12';
  }
}