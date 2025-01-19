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
      FOLLOW_PATH: '/:id/follow',
      UPDATE_USER_PATH: '/:id',
      DELETE_USER_PATH: '/:id',
    },

    POST: {
      BASE_URL: '/api/v1/posts',
      GET_ALL_POSTS_PATH: '/all',
      GET_LIKED_POSTS_PATH: '/liked',
      GET_FOLLOWING_POSTS_PATH: '/following',
      GET_USER_POSTS_PATH: '/:username',
      LIKE_POST_PATH: '/:id/likes',
      CREATE_POST_PATH: '/',
      COMMENT_POST_PATH: '/:id/comments',
      DELETE_POST_PATH: '/:id',
    },

    NOTIFICATION: {
      BASE_URL: '/api/v1/notifications',
      GET_NOTIFICATIONS_PATH: '/',
      DELETE_NOTIFICATIONS_PATH: '/'
    }
  }
};

export default ROUTES;