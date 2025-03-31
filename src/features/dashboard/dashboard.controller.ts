import { getTiktokDashboardData } from '#features/dashboard/dashboard.services.js';
import { ExpressHandler } from '#interfaces/global.types.js';

export const getDashboardData: ExpressHandler = async (_req, res, next) => {
  try {
    const dashboardData = await getTiktokDashboardData();
    res.json(dashboardData);
  } catch (err) {
    next(err);
  }
};
