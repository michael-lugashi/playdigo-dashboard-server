import authRouter from '#features/auth/auth.controller.js';
import { verifyToken } from '#features/auth/auth.middleware.js';
import dashboardRouter from '#features/dashboard/dashboard.controller.js';
import cors from 'cors';
import express from 'express';

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);

app.use(verifyToken);

app.use('/dashboard', dashboardRouter);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
