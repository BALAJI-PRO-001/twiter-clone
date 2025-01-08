export const UNAUTHORIZED_ACCESS_ERROR_MESSAGES = {
  COOKIE: {
    COOKIE_NOT_FOUND: 'Unauthorized: Cookie(Access Token) does not exist.',
    INVALID_COOKIE: 'Forbidden: Invalid cookie(Access Token).'
  },
  PASSWORD: 'Unauthorized: Invalid password.'
};


export const BAD_REQUEST_ERROR_MESSAGES = {
  INVALID_PAYLOAD: 'Bad Request: Invalid token payload.',
  INVALID_MONGODB_ID: 'Bad Request: Invalid mongodb database id.',
  INVALID_USER_DATA: 'Bad Request: Invalid user data.',
  INVALID_FOLLOWER: `You can't follow or unfollow your self.`
};


export const NOT_FOUND_ERROR_MESSAGES = {
  USERNAME: 'Not Found: Invalid username.',
  USER: 'Not Found: The specified user does not exist.',
};