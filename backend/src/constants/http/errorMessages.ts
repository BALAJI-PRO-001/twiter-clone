export const UNAUTHORIZED_ACCESS_ERROR_MESSAGES = {
  COOKIE: {
    COOKIE_NOT_FOUND: 'Cookie(Access Token) does not exist.',
    INVALID_COOKIE: 'Invalid cookie(Access Token).'
  },
  POST: {
    UNAUTHORIZED_OWNER: 'You do not have permission to delete this post.'
  },
  USER: {
    INVALID_USER_ID: 'Invalid user id.'
  },
  PASSWORD: 'Invalid password.'
};


export const BAD_REQUEST_ERROR_MESSAGES = {
  INVALID_PAYLOAD: 'Invalid token payload.',
  INVALID_MONGODB_ID: 'Invalid mongodb database id.',
  INVALID_USER_DATA: 'Invalid user data.',
  INVALID_FOLLOWER: `You can't follow or unfollow your self.`, 
};


export const NOT_FOUND_ERROR_MESSAGES = {
  USERNAME: 'Invalid username.',
  USER: 'The specified user does not exist.',
  POST: 'The specified post does not exist.'
};