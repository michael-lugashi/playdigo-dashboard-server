import { BaseError, GoogleSheetsUncaughtError, NotFoundError } from '#core/errors/custom.errors.js';
import { google } from 'googleapis';

import authorize from './google.sheets.auth.js';

export const getTiktokSheetData = async (): Promise<string[][]> => {
  try {
    const auth = await authorize();
    const sheets = google.sheets({ auth, version: 'v4' });
    const res = await sheets.spreadsheets.values.get({
      range: 'Tiktok Spend!A1:H',
      spreadsheetId: '11M6NgCSAz_MwYe36-eBKXv5LBiJ4L-TqubXLkLkfK24'
    });

    const values = res.data.values;
    if (!values || !Array.isArray(values)) {
      throw new NotFoundError('There is no data to display');
    }

    return values;
  } catch (error) {
    if (error instanceof BaseError) {
      throw error;
    }
    throw new GoogleSheetsUncaughtError(error);
  }
};
