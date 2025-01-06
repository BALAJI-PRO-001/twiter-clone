import express from 'express';
import { 
  signup, 
  login, 
  logout, 
  getAuthenticatedUser 
} from '../controllers/auth.controller';
import { 
  validateNewUserData, 
  validateUserCredentials
} from '../middlewares/validator';
import { verifyUserAccessToken } from '../middlewares/verifyUserAccessToken';


const router = express.Router();

router.post('/signup', validateNewUserData, signup)
      .post('/login', validateUserCredentials, login);

router.get('/logout', logout)
      .get('/user/authenticated',  verifyUserAccessToken, getAuthenticatedUser);

export default router;