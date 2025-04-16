import {
  BaseError,
  GoogleSheetsUncaughtError,
  InternalServerError,
  NotFoundError
} from '#core/errors/custom.errors.js';
import { sheets_v4 } from 'googleapis';

import sheets from './google.sheets.auth.js';
import { CellValue, SheetData } from './google.sheets.types.js';

const DATA_SHEET_ID = '1O7FYtZqZD548Pku5t6MeUfRBD6EU66G-0-ykQh2ezEE';

export const getSheetData = async (sheetName: string): Promise<SheetData> => {
  try {
    const res = await sheets.spreadsheets.get({
      fields: 'sheets(data(rowData(values(formattedValue,effectiveValue,userEnteredFormat))))',
      includeGridData: true,
      ranges: [sheetName],
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
