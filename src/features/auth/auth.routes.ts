import express from 'express';

import { authController } from './auth.controller.js';
import { validateAuth } from './auth.validation.js';

const authRouter = express.Router();

authRouter.post('/authenticate', validateAuth, authController);

export default authRouter;
