import Database from 'better-sqlite3';
import path from 'node:path';

const DB_URL =
  process.env.DATABASE_URL ||
  (process.env.NODE_ENV === 'production' ? '' : 'database.sqlite');

if (!DB_URL) {
  throw new Error('❌ DATABASE_URL is required in production environment');
}
const DB_PATH = path.resolve(process.cwd(), DB_URL);

const db = new Database(DB_PATH);
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

export { db };
