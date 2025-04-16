import { NotFoundError } from '#core/errors/custom.errors.js';
import { getUserById, getUsers as getUsersFromSheet } from '#core/google.sheets/google.sheets.users.js';

interface UIUser {
  email: string;
  firstName: string;
  graphAccess: string[];
  id: string;
  institutionName: string;
  lastName: string;
  role: string;
}

export const getSheetOptions = async (userId: string): Promise<string[]> => {
  const user = await getUserById(userId);
  if (!user) throw new NotFoundError('User not found');

  const sheetOptions = user.sheets.split(',');
  return sheetOptions;
};

export const getUsers = async (): Promise<UIUser[]> => {
  const users = await getUsersFromSheet();
  const mappedUsers = users.map(
    ({ hashedPassword, institutionPrettyName, institutionServiceName, sheets, ...rest }) => ({
      graphAccess: sheets.split(','),
      institutionName: institutionPrettyName,
      ...rest
    })
  );

  return mappedUsers;
};
