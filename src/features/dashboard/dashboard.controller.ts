import { getDashboardData } from '#features/dashboard/dashboard.services.js';
import { ExpressHandler, ExpressHandlerWithToken } from '#interfaces/global.types.js';

import { DashboardDataAdminSchema, DashboardDataSchema } from './dashboard.validation.js';

export const getDashboardDataController: ExpressHandlerWithToken<unknown, DashboardDataSchema> = async (
  req,
  res,
  next
) => {
  try {
    const dashboardData = await getDashboardData(res.locals.tokenData.userId, req.query.sheetName);
    res.json(dashboardData);
  } catch (err) {
    next(err);
  }
};

export const getDashboardDataAdminController: ExpressHandler<unknown, DashboardDataAdminSchema> = async (
  req,
  res,
  next
) => {
  try {
    const { sheetName, userId } = req.query;
    const dashboardData = await getDashboardData(userId, sheetName);
    res.json(dashboardData);
  } catch (err) {
    next(err);
  }
};
