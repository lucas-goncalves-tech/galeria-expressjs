import { db } from './connection';
import fs from 'node:fs';
import path from 'node:path';

interface IMigration {
  id: number;
  name: string;
  run_on: string;
}

function runMigrations() {
  const migrationDir = path.resolve(__dirname, 'migrations');
  const migrationFiles = fs.readdirSync(migrationDir).sort();

  db.exec('BEGIN TRANSACTION;');
  db.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      run_on TEXT DEFAULT CURRENT_TIMESTAMP
    ) STRICT;
    `);
  console.log('Starting database migrations...');
  try {
    migrationFiles.forEach((file) => {
      const allrunMigrationsStmt = db.prepare(
        'SELECT * FROM migrations WHERE name = ?',
      );
      const alreadyRun = allrunMigrationsStmt.get(file);
      if (alreadyRun) {
        console.log(`Skipping already executed migration: ${file}`);
        return;
      }

      const filePath = path.join(migrationDir, file);
      const sql = fs.readFileSync(filePath, 'utf-8');
      db.exec(sql);
      const insertMigration = db.prepare(
        'INSERT INTO migrations (name) VALUES (?)',
      );
      insertMigration.run(file);
      console.log(`Executed migration: ${file}`);
    });
    db.exec('COMMIT;');
    console.log('Database migrations completed.');
  } catch (error) {
    db.exec('ROLLBACK;');
    console.log('Error during migrations, rolled back changes.', error);
    process.exit(1);
  }
}

export { runMigrations };
