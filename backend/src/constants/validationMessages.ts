export const USERNAME_VALIDATION_MESSAGES = {
  REQUIRED_CHARACTERS: 'Username can only contain letters, numbers, and underscores.',
  REQUIRED_LENGTH: 'Username must be at least 5 characters or long.',
  DUPLICATE_USER_NAME: 'Duplicate: Username is already used by another account.'
};


export const USER_FULLNAME_VALIDATION_MESSAGES = {
  REQUIRED_LENGTH: 'User fullname must be at least 5 characters or long.'
};


export const EMAIL_VALIDATION_MESSAGES = {
  INVALID_EMAIL: 'Please provide valid email (Gmail only).',
  DUPLICATE_EMAIL: 'Duplicate: Email is already used by another account.'
};


export const PASSWORD_VALIDATION_MESSAGES = {
  REQUIRED_LENGTH: 'must be at least 8 characters or long.', // Prefix provided by called method.
  REQUIRED_CHARACTERS: 'must be one character: letter, number, or special character.',
  INVALID_PASSWORD: 'cannot be the same as username and fullname.'
};


export const BIO_VALIDATION_MESSAGES = {
  INVALID_BIO: 'Bio must be string.'
};


export const EMPTY_UPDATE_FIELDS_MESSAGE = 'No fields provided for update.';
export const REQUIRED_PASSWORD_FIELDS_MESSAGE = 'Both current password and new password are required.';

export const POST_TEXT_VALIDATION_MESSAGE = 'Text message must be string.';
export const POST_MISSING_FIELDS_MESSAGE = 'Post must have text or imgURL.';
