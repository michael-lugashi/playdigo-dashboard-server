import { verifyAdmin } from '#features/auth/auth.middleware.js';
import express from 'express';

import {
  getAllGraphOptionsController,
  getSheetOptionsController,
  getUsersController,
  updateUserController
} from './user.controller.js';
import { validateUpdateUser } from './user.validation.js';

const userRouter = express.Router();

userRouter.get('/sheet-options', getSheetOptionsController);

userRouter.get('/all-graph-options', verifyAdmin, getAllGraphOptionsController);

userRouter.get('/', verifyAdmin, getUsersController);

userRouter.put('/:userId?', verifyAdmin, validateUpdateUser, updateUserController);

export default userRouter;
