import { verifyAdmin } from '#features/auth/auth.middleware.js';
import {
  getDashboardDataAdminController,
  getDashboardDataController
} from '#features/dashboard/dashboard.controller.js';
import express from 'express';

const dashboardRouter = express.Router();

dashboardRouter.get('/data', getDashboardDataController);

dashboardRouter.get('/data/admin', verifyAdmin, getDashboardDataAdminController);

export default dashboardRouter;
