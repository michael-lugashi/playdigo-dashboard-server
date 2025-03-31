import { google } from 'googleapis';

import authorize from './google.sheets.auth.js';

export const getTiktokSheetData = async (): Promise<string[][]> => {
  const auth = await authorize();
  const sheets = google.sheets({ auth, version: 'v4' });
  const res = await sheets.spreadsheets.values.get({
    range: 'Tiktok Spend!A1:H',
    spreadsheetId: '11M6NgCSAz_MwYe36-eBKXv5LBiJ4L-TqubXLkLkfK24'
  });

  const values = res.data.values;
  if (!values || !Array.isArray(values)) {
    throw new Error('No data found in spreadsheet');
  }

  return values;
};
