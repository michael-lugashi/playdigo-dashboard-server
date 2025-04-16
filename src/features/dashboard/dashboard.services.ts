import { NotFoundError } from '#core/errors/custom.errors.js';
import { CellValue } from '#core/google.sheets/google.sheets.types.js';

import { getSheetData } from '../../core/google.sheets/google.sheets.dashboard.js';
import { getUserById } from '../../core/google.sheets/google.sheets.users.js';

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
  if (!user.sheets.split(',').includes(sheetName)) throw new NotFoundError('Sheet not found');
  const { headers, sheetData } = await getSheetData(sheetName);
  const graphData = genGraphData(headers, sheetData);
  return { graphData, headers, tableData: sheetData };
};
