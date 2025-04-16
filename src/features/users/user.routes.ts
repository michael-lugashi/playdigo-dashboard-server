import { verifyAdmin } from '#features/auth/auth.middleware.js';
import express from 'express';

import { getSheetOptionsController, getUsersController } from './user.controller.js';

const userRouter = express.Router();

userRouter.get('/sheet-options', getSheetOptionsController);

userRouter.get('/', verifyAdmin, getUsersController);

export default userRouter;
