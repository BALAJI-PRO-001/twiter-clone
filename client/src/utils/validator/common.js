import joi from 'joi';

export function ensureFieldValueExists(fieldName, value) {
  if (value === undefined || value === null) {
    throw new Error(`${fieldName} is null or undefined.`);
  }
}



export function extractErrorType(err) {
  if (err === null || err === undefined ) {
    throw new Error('Error is null or undefined.');
  } 

  if (!(err instanceof joi.ValidationError)) {
    throw new Error("Expected a Joi ValidationError instance.");
  }

  if (err.details.length === 0) {
    throw new Error("ValidationError does not contain any details.");
  }
  
  return err.details[0].type;
}