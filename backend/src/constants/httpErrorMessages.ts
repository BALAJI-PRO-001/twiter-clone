export const UNAUTHORIZED_ACCESS_ERROR_MESSAGES = {
  COOKIE: {
    COOKIE_NOT_FOUND: 'Unauthorized: Cookie(Access Token) does not exist.',
    INVALID_COOKIE: 'Forbidden: Invalid cookie(Access Token).'
  },
  PASSWORD: 'Unauthorized: Invalid password.',
  POST: {
    UNAUTHORIZED_OWNER: 'Unauthorized: You do not have permission to delete this post.'
  },
  USER: {
    INVALID_USER_ID: 'Unauthorized: Invalid user id.'
  }
};


export const BAD_REQUEST_ERROR_MESSAGES = {
  INVALID_PAYLOAD: 'Bad Request: Invalid token payload.',
  INVALID_MONGODB_ID: 'Bad Request: Invalid mongodb database id.',
  INVALID_USER_DATA: 'Bad Request: Invalid user data.',
  INVALID_FOLLOWER: `You can't follow or unfollow your self.`,
  FOLLOWER_ID_NOT_PROVIDED: 'Follower id is required.'
};


export const NOT_FOUND_ERROR_MESSAGES = {
  USERNAME: 'Not Found: Invalid username.',
  USER: 'Not Found: The specified user does not exist.',
  POST: 'Not Found: The specified post does not exist.'
};