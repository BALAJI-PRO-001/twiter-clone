import express from 'express';
import cookieParser from 'cookie-parser';
import { v2 as cloudinary } from 'cloudinary';
import authRouter from './routes/auth.route';
import userRouter from './routes/user.route';
import postRouter from './routes/post.route';
import cloudinaryConfig from './config/cloudinary';
import ROUTES from './constants/routes';
import errorResponseHandler from './middlewares/errorResponseHandler';

const app = express();

/* Cloudinary config */
cloudinary.config(cloudinaryConfig);

/* Middlewares configs */
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

/* Router config */
app.use(ROUTES.V1.AUTHENTICATION.BASE_URL, authRouter);
app.use(ROUTES.V1.USER.BASE_URL, userRouter);
app.use(ROUTES.V1.POST.BASE_URL, postRouter);

/* Global error handler middleware function */
app.use(errorResponseHandler);

export default app;
