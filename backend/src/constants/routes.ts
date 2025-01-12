const ROUTES = {
  V1: {
    AUTHENTICATION: {
      BASE_URL: '/api/v1/auth',
      SIGNUP_PATH: '/signup',
      LOGIN_PATH: '/login',
      LOGOUT_PATH: '/logout',
      AUTHENTICATED_USER_PATH: '/user/authenticated'
    },

    USER: {
      BASE_URL: '/api/v1/users',
      GET_USER_PATH: '/:id',
      GET_SUGGESTED_USERS_PATH: '/:id/suggested',
      FOLLOW_PATH: ':id/follow',
      UPDATE_USER_PATH: '/:id',
      DELETE_USER_PATH: '/:id',
    },

    POST: {
      BASE_URL: '/api/v1/users',
      GET_ALL_POSTS_PATH: '/all',
      CREATE_POST_PATH: '',
      LIKE_POST_PATH: '/:id/like',
      COMMENT_POST_PATH: '/:id/comment',
      DELETE_POST_PATH: '/:id'
    }
  }
};

export default ROUTES;