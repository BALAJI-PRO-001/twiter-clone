import validator from 'joi';
import { STRING_ERROR_TYPES } from '../../constants/validator/errorTypes.js'

import { 
  ensureFieldValueExists, 
  extractErrorType, 
} from './common.js';

import { 
  FULLNAME_VALIDATION_MESSAGES, 
  USERNAME_VALIDATION_MESSAGES,
  EMAIL_VALIDATION_MESSAGES,
  PASSWORD_VALIDATION_MESSAGES,
} from '../../constants/validator/messages.js';



export async function validateUsername(username) {
  ensureFieldValueExists('Username', username);

  try {
    const schema = validator.string()
    .trim()
    .min(5)
    .lowercase()
    .regex(/^[a-z0-9_]+$/)
    .required()
    .label('Username');

    const value = await schema.validateAsync(username);
    return { isValid: true, value: value };
  } catch(err) {
    const errType = extractErrorType(err);
    let message = '';

    switch (errType) {
      case STRING_ERROR_TYPES.EMPTY: 
        message = USERNAME_VALIDATION_MESSAGES.EMPTY; 
        break;
      case STRING_ERROR_TYPES.MIN: 
        message = USERNAME_VALIDATION_MESSAGES.REQUIRED_LENGTH; 
        break;
      case STRING_ERROR_TYPES.PATTERN_BASE: 
        message = USERNAME_VALIDATION_MESSAGES.REQUIRED_CHARACTERS; 
        break;
    }

    return { isValid: false, message: message };
  }
}



export async function validateFullName(fullName) {
  ensureFieldValueExists('Fullname', fullName);

  try {
    const schema = validator.string()
      .trim()
      .min(5)
      .required()
      .label('Fullname');

    const value = await schema.validateAsync(fullName);
    return { isValid: true, value: value };
  } catch(err) {
    const errType = extractErrorType(err);
    let message = '';

    switch (errType) {
      case STRING_ERROR_TYPES.EMPTY: 
        message = FULLNAME_VALIDATION_MESSAGES.EMPTY; 
        break;
      case STRING_ERROR_TYPES.MIN: 
        message = FULLNAME_VALIDATION_MESSAGES.REQUIRED_LENGTH; 
        break;
    }

    return { isValid: false, message: message }
  }
}



export async function validateEmail(email) {
  ensureFieldValueExists('Email', email);

  try {
    const schema = validator.string()
      .email({ minDomainSegments: 1, tlds: { allow: ['com'] } })
      .required()
      .label('Email');

    const value = await schema.validateAsync(email);
    return { isValid: true, value: value };
  } catch(err) {
    const errType = extractErrorType(err);
    let message = '';

    switch (errType) {
      case STRING_ERROR_TYPES.EMPTY: 
        message = EMAIL_VALIDATION_MESSAGES.EMPTY; 
        break;
      case STRING_ERROR_TYPES.EMAIL: 
        message = EMAIL_VALIDATION_MESSAGES.INVALID_EMAIL; 
        break;
    }

    return { isValid: false, message: message };
  }
}



export async function validatePassword(fieldName, password) {
  ensureFieldValueExists(fieldName, password);
  
  try {
    const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    const schema = validator.string()
      .trim()
      .min(8)
      .regex(PASSWORD_REGEX)
      .required()
      .label(fieldName);

    const value = await schema.validateAsync(password);
    return { isValid: true, value: value };
  } catch(err) {
    const errType = extractErrorType(err);
    let message = '';

    switch (errType) {
      case STRING_ERROR_TYPES.EMPTY: 
        message = `${fieldName} ${PASSWORD_VALIDATION_MESSAGES.EMPTY}`;
        break;
      case STRING_ERROR_TYPES.MIN:
        message = `${fieldName} ${PASSWORD_VALIDATION_MESSAGES.REQUIRED_LENGTH}`;
        break;
      case STRING_ERROR_TYPES.PATTERN_BASE:
        message = `${fieldName} ${PASSWORD_VALIDATION_MESSAGES.REQUIRED_CHARACTERS}`;
        break;
    }

    return { isValid: false, message: message };
  }
}

