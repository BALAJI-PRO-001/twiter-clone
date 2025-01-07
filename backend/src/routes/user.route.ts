import express from 'express';
import { validateId, validateUserUpdateFields } from '../middlewares/validator';
import { verifyUserAccessToken } from '../middlewares/verifyUserAccessToken';
import { 
  getUser, 
  updateUser, 
  toggleFollower, 
  getSuggestedUsers, 
} from '../controllers/user.controller';


const router = express.Router();

router.get('/:id', validateId, verifyUserAccessToken, getUser)
      .get("/:id/suggested", validateId, verifyUserAccessToken, getSuggestedUsers);

router.post('/:id/follow', validateId, toggleFollower);

router.patch(
  '/:id', 
  validateId,
  verifyUserAccessToken,
  validateUserUpdateFields,
  updateUser
);

export default router;