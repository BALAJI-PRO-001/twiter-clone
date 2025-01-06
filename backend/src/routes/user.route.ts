import express from 'express';
import { validateId } from '../middlewares/validator';
import { verifyUserAccessToken } from '../middlewares/verifyUserAccessToken';
import { getUser, toggleFollower } from '../controllers/user.controller';


const router = express.Router();

router.get('/:id', validateId, verifyUserAccessToken, getUser);

router.post('/:id/follow', validateId, toggleFollower);

export default router;