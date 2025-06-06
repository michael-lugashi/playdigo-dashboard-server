import errorHandler from '#core/errors/error.handler.middleware.js';
import { verifyToken } from '#features/auth/auth.middleware.js';
import authRouter from '#features/auth/auth.routes.js';
import dashboardRouter from '#features/dashboard/dashboard.routes.js';
import userRouter from '#features/users/user.routes.js';
import cors from 'cors';
import express from 'express';

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);

app.use(verifyToken);

app.use('/dashboard', dashboardRouter);
app.use('/users', userRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
