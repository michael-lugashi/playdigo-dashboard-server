import { InternalServerError } from '#core/errors/custom.errors.js';

export const USER_KEYS = [
  'userId',
  'email',
  'hashedPassword',
  'sheets',
  'isAdmin',
  'institutionPrettyName',
  'institutionServiceName',
  'firstName',
  'lastName'
] as const;

export interface CellValue {
  formatted: string;
  value: boolean | number | string;
}

export interface SheetData {
  headers: string[];
  sheetData: CellValue[][];
}

export interface User {
  email: string;
  firstName: string;
  hashedPassword: string;
  institutionPrettyName: string;
  institutionServiceName: string;
  isAdmin: string;
  lastName: string;
  sheets: string;
  userId: string;
}

export interface UserFunctions {
  clearUserCache: () => void;
  getUsers: () => Promise<User[]>;
}

export type UserKey = (typeof USER_KEYS)[number];

export const isUserKey = (key: string): key is UserKey => USER_KEYS.includes(key as UserKey);

export const isUserData = (data: unknown[]): data is string[] =>
  data.length === USER_KEYS.length && data.every((value) => typeof value === 'string');

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
