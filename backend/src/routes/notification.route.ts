import express from 'express';
import ROUTES from '../constants/routes';
import verifyUserAccessToken from '../middlewares/verifyUserAccessToken';
import { getNotification, deleteNotification } from '../controllers/notification.controller';


const { 
  GET_NOTIFICATIONS_PATH,
  DELETE_NOTIFICATIONS_PATH
} = ROUTES.V1.NOTIFICATION;

const router = express.Router();


router.get(GET_NOTIFICATIONS_PATH, verifyUserAccessToken, getNotification);

router.delete(DELETE_NOTIFICATIONS_PATH, verifyUserAccessToken, deleteNotification);


export default router;