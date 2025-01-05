import express from 'express';
import { signup, login, logout } from '../controllers/auth.controller';
import { 
  validateNewUserData, 
  validateUserCredentials 
} from '../middlewares/validator';

const router = express.Router();

router.post('/signup', validateNewUserData, signup)
      .post('/login', validateUserCredentials, login);

router.get('/logout', logout);

export default router;