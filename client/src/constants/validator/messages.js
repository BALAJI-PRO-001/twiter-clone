export const USERNAME_VALIDATION_MESSAGES = {
  EMPTY: `Username can't be empty.`,
  REQUIRED_LENGTH: 'Username must be at least 5 characters or long.',
  REQUIRED_CHARACTERS: 'Username can only contain letters, numbers, and underscores.',
  DUPLICATE_USER_NAME: 'Duplicate: Username is already used by another account.'
};


export const FULLNAME_VALIDATION_MESSAGES = {
  EMPTY: `Fullname can't be empty.`,
  REQUIRED_LENGTH: 'Fullname must be at least 5 characters or long.',
};


export const EMAIL_VALIDATION_MESSAGES = {
  EMPTY: `Email can't be empty.`,
  INVALID_EMAIL: 'Invalid email. provide valid email.'
}


export const PASSWORD_VALIDATION_MESSAGES = {
  EMPTY: `can't be empty.`,
  REQUIRED_LENGTH: 'must be at least 8 characters or long.',
  REQUIRED_CHARACTERS: 'must be one character: letter, number, or special character.',
  INVALID_PASSWORD: 'cannot be the same as username and fullname.'
};