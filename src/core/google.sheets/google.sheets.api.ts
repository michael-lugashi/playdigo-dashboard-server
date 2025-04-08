import {
  BaseError,
  GoogleSheetsUncaughtError,
  InternalServerError,
  NotFoundError
} from '#core/errors/custom.errors.js';
import { google, sheets_v4 } from 'googleapis';

import authorize from './google.sheets.auth.js';
import { CellValue, isUserData, SheetData, transformUserData, User, UserFunctions } from './google.sheets.types.js';

const DATA_SHEET_ID = '1O7FYtZqZD548Pku5t6MeUfRBD6EU66G-0-ykQh2ezEE';
const USER_SHEET_ID = '1uliMkvCNzlncqH-ahh5u9QK5ebPWtXml_5r4cYPpW0g';

export const getSheetData = async (sheetName: string, range: string): Promise<SheetData> => {
  try {
    const auth = await authorize();
    const sheets = google.sheets({ auth, version: 'v4' });

    const res = await sheets.spreadsheets.get({
      fields: 'sheets(data(rowData(values(formattedValue,effectiveValue,userEnteredFormat))))',
      includeGridData: true,
      ranges: [`${sheetName}!A1:${range}`],
      spreadsheetId: DATA_SHEET_ID
    });

    const sheet = res.data.sheets?.[0]?.data?.[0]?.rowData?.map((row) => {
      if (!row.values) {
        throw new InternalServerError('Incomplete google sheets data');
      }
      return row.values;
    });

    if (!sheet || sheet.length === 0) {
      throw new NotFoundError('There is no data to display');
    }

    const [headersData, ...data] = sheet;
    const headers = headersData.map((header) => {
      if (!header.formattedValue) {
        throw new InternalServerError('Incomplete google sheets data');
      }
      return header.formattedValue;
    });

    return { headers, sheetData: processSheetData(data) };
  } catch (error) {
    if (error instanceof BaseError) {
      throw error;
    }
    throw new GoogleSheetsUncaughtError(error);
  }
};

export const generateUserFunctions = (): UserFunctions => {
  let cachedUsers: null | User[] = null;

  return {
    clearUserCache: () => {
      cachedUsers = null;
    },
    getUsers: async () => {
      if (cachedUsers) return cachedUsers;

      const auth = await authorize();
      const sheets = google.sheets({ auth, version: 'v4' });
      const res = await sheets.spreadsheets.values.get({
        range: 'userData!A1:I',
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
};

const { getUsers } = generateUserFunctions();

export const getUserByEmail = async (email: string): Promise<null | User> => {
  const users = await getUsers();
  const user = users.find((user) => user.email === email);
  return user ?? null;
};

export const getUserById = async (userId: string): Promise<null | User> => {
  const users = await getUsers();
  const user = users.find((user) => user.userId === userId);
  return user ?? null;
};

const processSheetData = (sheet: sheets_v4.Schema$CellData[][]): CellValue[][] =>
  sheet.reduce<CellValue[][]>((acc, rowData) => {
    const row = rowData.reduce<CellValue[]>((rowAcc, cell) => {
      const formatted = cell.formattedValue ?? '';
      let value: boolean | number | string = '';

      if (cell.effectiveValue) {
        if ('numberValue' in cell.effectiveValue && typeof cell.effectiveValue.numberValue === 'number') {
          const numberValue = cell.effectiveValue.numberValue;
          // Check if the cell is formatted as a date
          if (['DATE', 'DATE_TIME'].includes(cell.userEnteredFormat?.numberFormat?.type ?? '')) {
            value = convertSerialToTimestamp(numberValue);
          } else {
            value = numberValue;
          }
        } else if ('stringValue' in cell.effectiveValue) {
          value = cell.effectiveValue.stringValue ?? '';
        } else if ('boolValue' in cell.effectiveValue) {
          value = cell.effectiveValue.boolValue ?? false;
        }
      }

      rowAcc.push({ formatted, value });
      return rowAcc;
    }, []);

    acc.push(row);
    return acc;
  }, []);

const convertSerialToTimestamp = (serial: number): number => {
  const baseDate = new Date(Date.UTC(1899, 11, 30)); // Google Sheets' epoch base
  return baseDate.getTime() + serial * 86400000;
};
