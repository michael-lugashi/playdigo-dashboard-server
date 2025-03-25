import { verifyToken } from '#middlewares/authentication.js';
import authRouter from '#routes/authRoutes.js';
import dashboardRouter from '#routes/dashboardRoutes.js';
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
  console.log(`Example app listening on port ${port}`);
});
