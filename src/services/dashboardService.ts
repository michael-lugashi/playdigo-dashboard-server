import { getTiktokSheetData } from './googleSheetsAPI.js';

interface DashboardData {
  displayData: string[][];
  graphData: GraphData[];
  headers: string[];
}

interface GraphData {
  date: string;
  impressions: number;
  spend: number;
}

const aggregateTiktokSheetData = (sheetData: string[][]): DashboardData => {
  const [headers, ...rows] = sheetData;
  const graphData: GraphData[] = [];
  const displayData: string[][] = [];

  rows.forEach((row: string[]) => {
    // Convert date from 'M/D/YYYY' to 'YYYY-MM-DD'
    const [month, day, year] = row[0].split('/');
    const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

    // Convert spend and impressions to numbers
    const spend = Number(row[1].replace('$', '').replaceAll(',', ''));
    const impressions = Number(row[4].replaceAll(',', ''));

    graphData.push({ date: formattedDate, impressions, spend });
    displayData.push([formattedDate, ...row.slice(1)]);
  });

  return { displayData, graphData, headers };
};

export const getTiktokDashboardData = async (): Promise<DashboardData> => {
  const rawTiktokSheetData = await getTiktokSheetData();
  return aggregateTiktokSheetData(rawTiktokSheetData);
};
