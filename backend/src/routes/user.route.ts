import express, { Request, Response, NextFunction } from 'express';
import { validateId, validateUserUpdateFields } from '../middlewares/validator';
import verifyUserAccessToken from '../middlewares/verifyUserAccessToken';

import {
  getUser,
  updateUser,
  toggleFollower,
  getSuggestedUsers,
  deleteUser,
} from '../controllers/user.controller';

import ROUTES from '../constants/routes';


const {
  GET_USER_PATH,
  GET_SUGGESTED_USERS_PATH,
  FOLLOW_PATH,
  UPDATE_USER_PATH,
  DELETE_USER_PATH
} = ROUTES.V1.USER;


function validateIdFields(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  validateId(['id', 'followerId'], req, res, next);
}


const router = express.Router();

router.get(GET_USER_PATH, validateIdFields, verifyUserAccessToken, getUser)
      .get(GET_SUGGESTED_USERS_PATH, validateIdFields, verifyUserAccessToken, getSuggestedUsers);

router.post(FOLLOW_PATH, validateIdFields, verifyUserAccessToken, toggleFollower);

router.patch(
  UPDATE_USER_PATH, 
  validateIdFields, 
  verifyUserAccessToken, 
  validateUserUpdateFields,
  updateUser
);


router.delete(
  DELETE_USER_PATH, 
  validateIdFields, 
  verifyUserAccessToken, 
  deleteUser
);


export default router;