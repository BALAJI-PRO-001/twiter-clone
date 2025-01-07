import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.route';
import userRouter from './routes/user.route';
import { v2 as cloudinary } from 'cloudinary';
import cloudinaryConfig from './config/cloudinary';
import errorResponseHandler from './middlewares/errorResponseHandler';

const app = express();

/* Cloudinary config */
cloudinary.config(cloudinaryConfig);

/* Middlewares configs */
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

/* Router config */
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);

/* Global error handler middleware function */
app.use(errorResponseHandler);

export default app;
