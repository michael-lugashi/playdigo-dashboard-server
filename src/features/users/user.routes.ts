import express from 'express';

import { getSheetOptionsController } from './user.controller.js';

const userRouter = express.Router();

userRouter.get('/sheet-options', getSheetOptionsController);

export default userRouter;
