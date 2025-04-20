import { getAllSheetNames } from '#core/google.sheets/google.sheets.dashboard.js';
import {
  createUser,
  getSheetOptions,
  getUsers,
  updateUser,
  updateUserPassword
} from '#features/users/user.services.js';
import { ExpressHandlerWithToken } from '#interfaces/global.types.js';

import {
  CreateUserBodySchema,
  UpdatePasswordBodySchema,
  UpdateUserBodySchema,
  UpdateUserParamsSchema
} from './user.validation.js';

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
    const updatedUser = await updateUser(req.params.userId, req.body);
    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
};

export const getAllGraphOptionsController: ExpressHandlerWithToken = async (_req, res, next) => {
  try {
    const sheetOptions = await getAllSheetNames();
    res.json(sheetOptions);
  } catch (err) {
    next(err);
  }
};

export const createUserController: ExpressHandlerWithToken<CreateUserBodySchema> = async (req, res, next) => {
  try {
    const createdUser = await createUser(req.body);
    res.json(createdUser);
  } catch (err) {
    next(err);
  }
};

export const updatePasswordController: ExpressHandlerWithToken<
  UpdatePasswordBodySchema,
  unknown,
  UpdateUserParamsSchema
> = async (req, res, next) => {
  try {
    const updatedUser = await updateUserPassword(req.params.userId, req.body.password);
    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
};
