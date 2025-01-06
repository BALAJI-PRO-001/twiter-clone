import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.route';
import userRouter from './routes/user.route';
import errorResponseHandler from './middlewares/errorResponseHandler';

const app = express();

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
