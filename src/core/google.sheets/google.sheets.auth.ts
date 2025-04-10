import fs from 'fs';
import { google } from 'googleapis';
import path from 'path';

interface GoogleServiceAccountCredentials {
  auth_provider_x509_cert_url: string;
  auth_uri: string;
  client_email: string;
  client_id: string;
  client_x509_cert_url: string;
  private_key: string;
  private_key_id: string;
  project_id: string;
  token_uri: string;
  type: 'service_account';
  universe_domain: string;
}

const createSheetsApi = () => {
  const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
  const CREDENTIALS_PATH = path.join(process.cwd(), 'src/core/google.sheets/google.sheets.credentials.json');
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8')) as GoogleServiceAccountCredentials;

  const auth = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: SCOPES
  });

  const sheets = google.sheets({ auth, version: 'v4' });
  return sheets;
};

const sheets = createSheetsApi();
export default sheets;
