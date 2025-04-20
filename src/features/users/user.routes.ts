import { verifyAdmin } from '#features/auth/auth.middleware.js';
import express from 'express';

import {
  createUserController,
  deleteUserController,
  getAllGraphOptionsController,
  getSheetOptionsController,
  getUsersController,
  updatePasswordController,
  updateUserController
} from './user.controller.js';
import { validateCreateUser, validateUpdatePassword, validateUpdateUser } from './user.validation.js';

const userRouter = express.Router();

userRouter.get('/sheet-options', getSheetOptionsController);

userRouter.get('/all-graph-options', verifyAdmin, getAllGraphOptionsController);

userRouter.get('/', verifyAdmin, getUsersController);

userRouter.put('/:userId?', verifyAdmin, validateUpdateUser, updateUserController);

userRouter.put('/:userId/password', verifyAdmin, validateUpdatePassword, updatePasswordController);

userRouter.post('/create', verifyAdmin, validateCreateUser, createUserController);

userRouter.delete('/:userId', verifyAdmin, deleteUserController);

export default userRouter;
