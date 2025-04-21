import { ConflictError, InternalServerError, NotFoundError } from '#core/errors/custom.errors.js';

import sheets from './google.sheets.auth.js';
import { isUserData, isUserKey, isUserKeyArray, User, UserFunctions, UserKey } from './google.sheets.types.js';

const USER_SHEET_ID = '1uliMkvCNzlncqH-ahh5u9QK5ebPWtXml_5r4cYPpW0g';

// Module-level state
let cachedUsers: null | User[] = null;
let headerMap: Partial<Record<UserKey, string>> = {};
let userKeyMap: Partial<Record<string, number>> = {};

export const { clearUserCache, getUsers } = ((): UserFunctions => {
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
    }
  };
})();

export const updateUserBatch = async (userId: string, updates: Partial<User>): Promise<void> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  const userIndex = userKeyMap[userId];
  if (userIndex === undefined) {
    throw new InternalServerError('User index not found');
  }

  const updateFieldsForSheets = Object.entries(updates).map(([key, value]) => {
    const headerLetter = headerMap[key as UserKey];
    if (headerLetter === undefined) {
      throw new InternalServerError('Header letter not found');
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
};

export const updateUserValue = async (userId: string, key: UserKey, value: string): Promise<void> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  const userIndex = userKeyMap[userId];
  if (userIndex === undefined) {
    throw new InternalServerError('User index not found');
  }

  const headerLetter = headerMap[key];
  if (headerLetter === undefined) {
    throw new InternalServerError('Header letter not found');
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
};

export const createUser = async (user: User): Promise<User> => {
  const userExists = Boolean(await getUserByEmail(user.email));
  if (userExists) {
    throw new ConflictError('User with this email already exists');
  }

  await sheets.spreadsheets.values.append({
    range: 'userData',
    requestBody: {
      values: [
        [
          user.id,
          user.email,
          user.hashedPassword,
          user.sheets,
          user.role,
          user.institutionPrettyName,
          user.institutionServiceName,
          user.firstName,
          user.lastName
        ]
      ]
    },
    spreadsheetId: USER_SHEET_ID,
    valueInputOption: 'RAW'
  });

  clearUserCache();

  return user;
};

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

export const deleteUser = async (userId: string): Promise<void> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  const userIndex = userKeyMap[userId];
  if (userIndex === undefined) {
    throw new InternalServerError('User index not found');
  }

  await sheets.spreadsheets.batchUpdate({
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              dimension: 'ROWS',
              endIndex: userIndex,
              sheetId: 0,
              startIndex: userIndex - 1
            }
          }
        }
      ]
    },
    spreadsheetId: USER_SHEET_ID
  });

  clearUserCache();
};
