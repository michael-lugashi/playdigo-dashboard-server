import { InternalServerError, NotFoundError } from '#core/errors/custom.errors.js';
import { User, UserKey } from '#core/google.sheets/google.sheets.types.js';
import {
  getUserById,
  getUsers as getUsersFromSheet,
  updateUser as updateUserInSheet
} from '#core/google.sheets/google.sheets.users.js';

import { UIUser } from './user.types.js';

export const getSheetOptions = async (userId: string): Promise<string[]> => {
  const user = await getUserById(userId);
  if (!user) throw new NotFoundError('User not found');

  const sheetOptions = user.sheets.split(',');
  return sheetOptions;
};

export const getUsers = async (): Promise<UIUser[]> => {
  const users = await getUsersFromSheet();
  const mappedUsers = users.map(transformUser);
  return mappedUsers;
};

const transformUser = ({
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

export const updateUser = async (userId: string, key: UserKey, value: string): Promise<UIUser> => {
  await updateUserInSheet(userId, key, value);
  const updatedUser = await getUserById(userId);
  if (!updatedUser) throw new InternalServerError('Unable to get user after updating');
  const transformedUser = transformUser(updatedUser);
  return transformedUser;
};
