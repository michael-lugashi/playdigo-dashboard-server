import { getTiktokDashboardData } from '#features/dashboard/dashboard.services.js';
import express from 'express';

const dashboardRouter = express.Router();

dashboardRouter.get('/data', async (_req, res, next) => {
  try {
    const dashboardData = await getTiktokDashboardData();
    res.json(dashboardData);
  } catch (err) {
    next(err);
  }
});

export default dashboardRouter;
