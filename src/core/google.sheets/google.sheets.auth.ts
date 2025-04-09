import { BaseError, GoogleSheetsUncaughtError, InternalServerError } from '#core/errors/custom.errors.js';
import { authenticate } from '@google-cloud/local-auth';
import fs from 'fs/promises';
import { Auth, google, sheets_v4 } from 'googleapis';
import path from 'path';

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.

const TOKEN_PATH = path.join(process.cwd(), 'src/core/google.sheets/google.sheets.token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'src/core/google.sheets/google.sheets.credentials.json');

interface InstalledCredentials {
  client_id: string;
  client_secret: string;
} /**
 * Load or request or authorization to call APIs.
 */
async function authorize(): Promise<Auth.OAuth2Client> {
  try {
    const client = await loadSavedCredentialsIfExist();
    if (client) {
      return client;
    }

    const newClient = await authenticate({
      keyfilePath: CREDENTIALS_PATH,
      scopes: SCOPES
    });
    await saveCredentials(newClient);
    return newClient;
  } catch (error) {
    if (error instanceof BaseError) {
      throw error;
    }
    throw new GoogleSheetsUncaughtError(error);
  }
}

const deleteToken = async () => {
  clearCredentialsCache();
  await fs.unlink(TOKEN_PATH);
};

const genLoadSavedCredentialsIfExist = () => {
  let cachedCredentials: Auth.OAuth2Client | null = null;
  return {
    clearCredentialsCache: () => {
      cachedCredentials = null;
    },
    loadSavedCredentialsIfExist: async (): Promise<Auth.OAuth2Client | null> => {
      try {
        if (cachedCredentials) return cachedCredentials;
        const content = await fs.readFile(TOKEN_PATH, 'utf-8');
        const credentials = JSON.parse(content) as Auth.JWTInput;
        cachedCredentials = google.auth.fromJSON(credentials) as Auth.OAuth2Client;
        return cachedCredentials;
      } catch {
        return null;
      }
    }
  };
};

const { clearCredentialsCache, loadSavedCredentialsIfExist } = genLoadSavedCredentialsIfExist();

export async function googleSheetReqWrapper<T>(fn: (sheets: sheets_v4.Sheets) => Promise<T>): Promise<T> {
  let auth = await authorize();
  let sheets = google.sheets({ auth, version: 'v4' });
  try {
    return await fn(sheets);
  } catch (err: unknown) {
    const error = err as { response?: { data?: { error?: string } } };
    const code = error.response?.data?.error;
    if (code === 'invalid_grant') {
      await deleteToken();
      auth = await authorize();
      sheets = google.sheets({ auth, version: 'v4' });
      return await fn(sheets);
    }
    throw err;
  }
}

async function saveCredentials(client: Auth.OAuth2Client): Promise<void> {
  const content = await fs.readFile(CREDENTIALS_PATH, 'utf-8');
  const keys = JSON.parse(content) as { installed?: InstalledCredentials; web?: InstalledCredentials };
  const key = keys.installed ?? keys.web;
  if (!key) throw new InternalServerError('No valid google sheets credentials found');

  const payload = JSON.stringify({
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
    type: 'authorized_user'
  });

  await fs.writeFile(TOKEN_PATH, payload);
}
