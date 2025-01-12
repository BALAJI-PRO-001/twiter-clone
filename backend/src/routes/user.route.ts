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


function validateIdFields(
  req: Request, 
  res: Response,
  next: NextFunction
): void {
  validateId(['id', 'followerId'], req, res, next); 
}


const router = express.Router();

router.get('/:id', validateIdFields, verifyUserAccessToken, getUser)
      .get("/:id/suggested", validateIdFields, verifyUserAccessToken, getSuggestedUsers);

router.post('/:id/follow', validateIdFields, verifyUserAccessToken, toggleFollower);

router.patch(
  '/:id', 
  validateIdFields,
  verifyUserAccessToken,
  validateUserUpdateFields,
  updateUser
);


router.delete('/:id', validateIdFields, verifyUserAccessToken, deleteUser);


export default router;