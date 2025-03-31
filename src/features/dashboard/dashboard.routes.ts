import { getDashboardData } from '#features/dashboard/dashboard.controller.js';
import express from 'express';

const dashboardRouter = express.Router();

dashboardRouter.get('/data', getDashboardData);

export default dashboardRouter;
