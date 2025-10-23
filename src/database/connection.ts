import Database from 'better-sqlite3';
import path from 'node:path';

const DB_URL = process.env.DATABASE_URL || 'database.sqlite';
const DB_PATH = path.resolve(__dirname, DB_URL);

const db = new Database(DB_PATH);
db.pragma('foreign_keys = ON');

export { db };
