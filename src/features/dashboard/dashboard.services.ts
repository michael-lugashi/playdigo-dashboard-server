import { getTiktokSheetData } from '../../core/google.sheets/google.sheets.api.js';

interface DashboardData {
  graphData: GraphData[];
  headers: string[];
  tableData: string[][];
}

interface GraphData {
  date: string;
  impressions: number;
  spend: number;
}

const aggregateTiktokSheetData = (sheetData: string[][]): DashboardData => {
  const [headers, ...rows] = sheetData;
  const tableData: string[][] = rows;
  const graphData: GraphData[] = rows.map((row: string[]) => ({
    date: row[0],
    impressions: Number(row[4].replaceAll(',', '')),
    spend: Number(row[1].replace('$', '').replaceAll(',', ''))
  }));

  return { graphData, headers, tableData };
};

export const getTiktokDashboardData = async (): Promise<DashboardData> => {
  const rawTiktokSheetData = await getTiktokSheetData();
  return aggregateTiktokSheetData(rawTiktokSheetData);
};
