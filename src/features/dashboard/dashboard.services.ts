import { NotFoundError } from '#core/errors/custom.errors.js';
import { CellValue } from '#core/google.sheets/google.sheets.types.js';

import { getSheetData, getUserById } from '../../core/google.sheets/google.sheets.api.js';

interface DashboardData {
  graphData: GraphData[];
  headers: string[];
  tableData: CellValue[][];
}

interface GraphData {
  date: string;
  impressions: number;
  spend: number;
}

const genGraphData = (headers: string[], sheetData: CellValue[][]): GraphData[] => {
  const graphData: GraphData[] = sheetData.map(([date, spend, impressions]) => ({
    date: date.formatted,
    impressions: Number(impressions.value),
    spend: Number(spend.value)
  }));
  return graphData;
};

export const getDashboardData = async (userId: string, sheetName: string): Promise<DashboardData> => {
  const user = await getUserById(userId);
  if (!user) throw new NotFoundError('User not found');
  const sheetRange = user.sheets
    .split(',')
    .find((sheet) => sheet.includes(`${sheetName}!`))
    ?.split('!')[1];
  if (!sheetRange) throw new NotFoundError('Sheet not found');
  const { headers, sheetData } = await getSheetData(sheetName, sheetRange);
  const graphData = genGraphData(headers, sheetData);
  return { graphData, headers, tableData: sheetData };
};
