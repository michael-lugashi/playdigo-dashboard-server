import { BadRequestError, InternalServerError, NotFoundError } from '#core/errors/custom.errors.js';
import { getAllSheetNames } from '#core/google.sheets/google.sheets.dashboard.js';
import { User } from '#core/google.sheets/google.sheets.types.js';
import {
  createUser as createUserInSheet,
  deleteUser as deleteUserFromSheet,
  getUserByEmail,
  getUserById,
  getUsers as getUsersFromSheet,
  updateUserBatch,
  updateUserValue
} from '#core/google.sheets/google.sheets.users.js';
import { hashPassword } from '#features/auth/auth.services.js';
import camelCase from 'lodash.camelcase';
import { nanoid } from 'nanoid';

import { UIUser } from './user.types.js';
import { CreateUserBodySchema, UpdateUserBodySchema } from './user.validation.js';
export const getSheetOptions = async (userId: string): Promise<string[]> => {
  const user = await getUserById(userId);
  if (!user) throw new NotFoundError('User not found');

  const sheetOptions = user.sheets.split(',');
  return sheetOptions;
};

export const getUsers = async (): Promise<UIUser[]> => {
  const users = await getUsersFromSheet();
  const mappedUsers = users.map(transformToUserUI);
  return mappedUsers;
};

const transformToUserUI = ({
  hashedPassword,
  institutionPrettyName,
  institutionServiceName,
  sheets,
  ...rest
}: User): UIUser => ({
  graphAccess: sheets.split(','),
  institutionName: institutionPrettyName,
  ...rest
});

const transformToUserSheet = (user: UpdateUserBodySchema) =>
  Object.entries(user).reduce<Partial<User>>((acc, [key, value]) => {
    if (key === 'graphAccess') {
      acc.sheets = Array.isArray(value) ? value.join(',') : value;
    } else if (key === 'institutionName') {
      acc.institutionPrettyName = value as string;
      acc.institutionServiceName = camelCase(value as string);
    } else {
      acc[key as keyof User] = value as User[keyof User];
    }
    return acc;
  }, {});

const transformToUserForCreation = (user: Omit<CreateUserBodySchema, 'password'>): Omit<User, 'id'> => {
  const { graphAccess, institutionName, ...rest } = user;
  return {
    ...rest,
    hashedPassword: '', // This will be set later
    institutionPrettyName: institutionName,
    institutionServiceName: camelCase(institutionName),
    sheets: graphAccess.join(',')
  };
};

const validateGraphOptions = async (graphs: string[]) => {
  const validGraphs = await getAllSheetNames();
  graphs.forEach((graph) => {
    if (!validGraphs.includes(graph)) throw new BadRequestError('Invalid graph options');
  });
};

export const updateUser = async (userId: string, updates: UpdateUserBodySchema): Promise<UIUser> => {
  if (updates.graphAccess) {
    await validateGraphOptions(updates.graphAccess);
  }
  if (updates.email) {
    const user = await getUserByEmail(updates.email);
    if (user) throw new BadRequestError('Email already in use');
  }
  const updateFieldsForSheets = transformToUserSheet(updates);
  await updateUserBatch(userId, updateFieldsForSheets);
  const updatedUser = await getUserById(userId);
  if (!updatedUser) throw new InternalServerError('Unable to get user after updating');
  const transformedUser = transformToUserUI(updatedUser);
  return transformedUser;
};

export const createUser = async (user: CreateUserBodySchema): Promise<UIUser> => {
  const { password, ...rest } = user;
  await validateGraphOptions(rest.graphAccess);
  const userForSheet = transformToUserForCreation(rest);
  const hashedPassword = await hashPassword(password);
  const id = nanoid();
  const userWithIdAndPassword: User = {
    ...userForSheet,
    hashedPassword,
    id
  };
  const createdUser = await createUserInSheet(userWithIdAndPassword);
  const transformedUser = transformToUserUI(createdUser);
  return transformedUser;
};

export const updateUserPassword = async (userId: string, password: string): Promise<UIUser> => {
  const hashedPassword = await hashPassword(password);
  await updateUserValue(userId, 'hashedPassword', hashedPassword);
  const updatedUser = await getUserById(userId);
  if (!updatedUser) throw new InternalServerError('Unable to get user after updating password');
  const transformedUser = transformToUserUI(updatedUser);
  return transformedUser;
};

export const deleteUser = async (userId: string): Promise<void> => {
  const user = await getUserById(userId);
  if (!user) throw new NotFoundError('User not found');
  await deleteUserFromSheet(userId);
};
