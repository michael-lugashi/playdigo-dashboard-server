import { getSheetOptions } from '#features/users/user.services.js';
import { ExpressHandlerWithToken } from '#interfaces/global.types.js';

export const getSheetOptionsController: ExpressHandlerWithToken = async (req, res, next) => {
  try {
    const sheetOptions = await getSheetOptions(res.locals.tokenData.userId);
    res.json(sheetOptions);
  } catch (err) {
    next(err);
  }
};
