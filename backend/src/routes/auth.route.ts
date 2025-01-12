import express from 'express';
import verifyUserAccessToken  from '../middlewares/verifyUserAccessToken';
import { 
  signup, 
  login, 
  logout, 
  getAuthenticatedUser 
} from '../controllers/auth.controller';

import { 
  validateNewUserFields, 
  validateUserCredentials
} from '../middlewares/validator';


const router = express.Router();

router.post('/signup', validateNewUserFields, signup)
      .post('/login', validateUserCredentials, login);

router.get('/logout', logout)
      .get('/user/authenticated',  verifyUserAccessToken, getAuthenticatedUser);

export default router;