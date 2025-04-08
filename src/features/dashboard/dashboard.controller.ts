import { getDashboardData } from '#features/dashboard/dashboard.services.js';
import { ExpressHandler, ExpressHandlerWithToken } from '#interfaces/global.types.js';

export const getDashboardDataController: ExpressHandlerWithToken<unknown, { sheetName: string }> = async (
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

export const getDashboardDataAdminController: ExpressHandler<unknown, { sheetName: string; userId: string }> = async (
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
