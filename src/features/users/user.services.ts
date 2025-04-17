import { InternalServerError, NotFoundError } from '#core/errors/custom.errors.js';
import { User } from '#core/google.sheets/google.sheets.types.js';
import {
  getUserById,
  getUsers as getUsersFromSheet,
  updateUserBatch
} from '#core/google.sheets/google.sheets.users.js';
import camelCase from 'lodash.camelcase';

import { UIUser } from './user.types.js';
import { UpdateUserBodySchema } from './user.validation.js';
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

export const updateUser = async (userId: string, updates: UpdateUserBodySchema): Promise<UIUser> => {
  const updateFieldsForSheets = transformToUserSheet(updates);
  await updateUserBatch(userId, updateFieldsForSheets);
  const updatedUser = await getUserById(userId);
  if (!updatedUser) throw new InternalServerError('Unable to get user after updating');
  const transformedUser = transformToUserUI(updatedUser);
  return transformedUser;
};
