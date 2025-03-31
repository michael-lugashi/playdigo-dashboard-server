import { GoogleSheetsUncaughtError } from '#core/errors/custom.errors.js';
import { authenticate } from '@google-cloud/local-auth';
import fs from 'fs/promises';
import { Auth, google } from 'googleapis';

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.

const TOKEN_PATH = './google.sheets.credentials.json';
const CREDENTIALS_PATH = './google.sheets.credentials.json';

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
    throw new GoogleSheetsUncaughtError(error);
  }
}

async function loadSavedCredentialsIfExist(): Promise<Auth.OAuth2Client | null> {
  try {
    const content = await fs.readFile(TOKEN_PATH, 'utf-8');
    const credentials = JSON.parse(content) as Auth.JWTInput;
    return google.auth.fromJSON(credentials) as Auth.OAuth2Client;
  } catch {
    return null;
  }
}

async function saveCredentials(client: Auth.OAuth2Client): Promise<void> {
  const content = await fs.readFile(CREDENTIALS_PATH, 'utf-8');
  const keys = JSON.parse(content) as { installed?: InstalledCredentials; web?: InstalledCredentials };
  const key = keys.installed ?? keys.web;
  if (!key) throw new Error('No valid credentials found');

  const payload = JSON.stringify({
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
    type: 'authorized_user'
  });

  await fs.writeFile(TOKEN_PATH, payload);
}

export default authorize;
