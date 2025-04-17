import { InternalServerError, NotFoundError } from '#core/errors/custom.errors.js';

import sheets from './google.sheets.auth.js';
import { isUserData, isUserKey, isUserKeyArray, User, UserFunctions, UserKey } from './google.sheets.types.js';

const USER_SHEET_ID = '1uliMkvCNzlncqH-ahh5u9QK5ebPWtXml_5r4cYPpW0g';

export const {
  clearUserCache,
  getUsers,
  updateUserBatch,
  updateUserValue: updateUser
} = ((): UserFunctions => {
  let cachedUsers: null | User[] = null;
  let headerMap: Partial<Record<UserKey, string>> = {};
  let userKeyMap: Partial<Record<string, number>> = {};

  return {
    clearUserCache: () => {
      cachedUsers = null;
      headerMap = {};
      userKeyMap = {};
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

      if (!isUserKeyArray(headers)) {
        throw new InternalServerError('Invalid headers format');
      }

      headers.forEach((header, index) => {
        headerMap[header] = String.fromCharCode(65 + index);
      });

      cachedUsers = userRows.map((row) => transformUserData(headers, row));

      cachedUsers.forEach((user, index) => {
        userKeyMap[user.id] = index + 2;
      });

      return cachedUsers;
    },

    updateUserBatch: async (userId: string, updates: Partial<User>) => {
      const users = await getUsers();
      const user = users.find((user) => user.id === userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      const userIndex = userKeyMap[userId];
      const updateFieldsForSheets = Object.entries(updates).map(([key, value]) => {
        const headerLetter = headerMap[key as UserKey];
        if (userIndex === undefined || headerLetter === undefined) {
          throw new InternalServerError('Update coordinates do not exist');
        }
        return {
          range: `userData!${headerLetter}${String(userIndex)}`,
          values: [[value]]
        };
      });

      await sheets.spreadsheets.values.batchUpdate({
        requestBody: {
          data: updateFieldsForSheets,
          valueInputOption: 'RAW'
        },
        spreadsheetId: USER_SHEET_ID
      });

      clearUserCache();
    },
    updateUserValue: async (userId: string, key: UserKey, value: string) => {
      const users = await getUsers();
      const user = users.find((user) => user.id === userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      const userIndex = userKeyMap[userId];
      const headerLetter = headerMap[key];

      if (userIndex === undefined || headerLetter === undefined) {
        throw new InternalServerError('Update coordinates do not exist');
      }

      await sheets.spreadsheets.values.update({
        range: `userData!${headerLetter}${String(userIndex)}`,
        requestBody: {
          values: [[value]]
        },
        spreadsheetId: USER_SHEET_ID,
        valueInputOption: 'RAW'
      });

      clearUserCache();
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
