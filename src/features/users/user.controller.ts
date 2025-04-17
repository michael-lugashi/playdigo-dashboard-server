import { getSheetOptions, getUsers, updateUser } from '#features/users/user.services.js';
import { ExpressHandlerWithToken } from '#interfaces/global.types.js';

import { UpdateUserBodySchema, UpdateUserParamsSchema } from './user.validation.js';

export const getSheetOptionsController: ExpressHandlerWithToken = async (req, res, next) => {
  try {
    const sheetOptions = await getSheetOptions(res.locals.tokenData.userId);
    res.json(sheetOptions);
  } catch (err) {
    next(err);
  }
};

export const getUsersController: ExpressHandlerWithToken = async (req, res, next) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

export const updateUserController: ExpressHandlerWithToken<
  UpdateUserBodySchema,
  unknown,
  UpdateUserParamsSchema
> = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { key, value } = req.body;
    const updatedUser = await updateUser(userId, key, value);
    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
};
