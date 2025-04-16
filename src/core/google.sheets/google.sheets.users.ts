import { InternalServerError } from '#core/errors/custom.errors.js';

import sheets from './google.sheets.auth.js';
import { isUserData, isUserKey, User, UserFunctions } from './google.sheets.types.js';

const USER_SHEET_ID = '1uliMkvCNzlncqH-ahh5u9QK5ebPWtXml_5r4cYPpW0g';

export const { clearUserCache, getUsers } = ((): UserFunctions => {
  let cachedUsers: null | User[] = null;

  return {
    clearUserCache: () => {
      cachedUsers = null;
    },
    getUsers: async () => {
      if (cachedUsers) return cachedUsers;

      const res = await sheets.spreadsheets.values.get({
        range: 'userData',
        spreadsheetId: USER_SHEET_ID
      });

      const users = res.data.values;
      if (!users || !Array.isArray(users) || users.length < 2) {
        throw new InternalServerError('Users data is incomplete');
      }

      const [headers, ...userRows] = users;

      if (!isUserData(headers)) {
        throw new InternalServerError('Invalid headers format');
      }

      cachedUsers = userRows.map((row) => transformUserData(headers, row));
      return cachedUsers;
    }
  };
})();

export const getUserByEmail = async (email: string): Promise<null | User> => {
  const users = await getUsers();
  const user = users.find((user) => user.email === email);
  return user ?? null;
};

export const getUserById = async (userId: string): Promise<null | User> => {
  const users = await getUsers();
  const user = users.find((user) => user.id === userId);
  return user ?? null;
};

export const transformUserData = (headers: string[], userData: unknown[]): User => {
  if (!isUserData(userData)) {
    throw new InternalServerError('Invalid user data format');
  }

  return headers.reduce<User>((acc, header, index) => {
    if (!isUserKey(header)) {
      throw new InternalServerError(`Invalid header: ${header}`);
    }
    acc[header] = userData[index];
    return acc;
  }, {} as User);
};
