export const USER_KEYS = [
  'id',
  'email',
  'hashedPassword',
  'sheets',
  'role',
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
  id: string;
  institutionPrettyName: string;
  institutionServiceName: string;
  lastName: string;
  role: string;
  sheets: string;
}

export interface UserFunctions {
  clearUserCache: () => void;
  getUsers: () => Promise<User[]>;
  updateUserBatch: (userId: string, updates: Partial<User>) => Promise<void>;
  updateUserValue: (userId: string, key: UserKey, value: string) => Promise<void>;
}

export type UserKey = (typeof USER_KEYS)[number];

export const isUserKey = (key: unknown): key is UserKey => USER_KEYS.includes(key as UserKey);

export const isUserKeyArray = (data: unknown[]): data is UserKey[] =>
  data.length === USER_KEYS.length && data.every((value) => isUserKey(value));

export const isUserData = (data: unknown[]): data is string[] =>
  data.length === USER_KEYS.length && data.every((value) => typeof value === 'string');
