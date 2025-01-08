import express from 'express';
import cookieParser from 'cookie-parser';
import { v2 as cloudinary } from 'cloudinary';
import authRouter from './routes/auth.route';
import userRouter from './routes/user.route';
import postRouter from './routes/post.route';
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
app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', postRouter);

/* Global error handler middleware function */
app.use(errorResponseHandler);

export default app;
