import { verifyAdmin } from '#features/auth/auth.middleware.js';
import {
  getDashboardDataAdminController,
  getDashboardDataController
} from '#features/dashboard/dashboard.controller.js';
import { validateDashboardData, validateDashboardDataAdmin } from '#features/dashboard/dashboard.validation.js';
import express from 'express';

const dashboardRouter = express.Router();

dashboardRouter.get('/data', validateDashboardData, getDashboardDataController);

dashboardRouter.get('/data/admin', verifyAdmin, validateDashboardDataAdmin, getDashboardDataAdminController);

export default dashboardRouter;
