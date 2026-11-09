import { createClient } from '@libsql/client';

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

export function getDb() {
  if (!url) throw new Error('TURSO_DATABASE_URL is not configured');
  return createClient({ url, authToken });
}

let inited = false;
export async function ensureSchema() {
  if (inited) return;
  const db = getDb();
  await db.batch([
    `CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      child_name TEXT NOT NULL,
      child_age TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS site_config (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )`,
  ], 'write');
  inited = true;
}

export function isAdmin(req: { headers: Record<string, string | string[] | undefined> }) {
  const pass = req.headers['x-admin-password'];
  return pass === 'POOCHANDI@#2001';
}
