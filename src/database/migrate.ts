import { db } from './connection';
import fs from 'node:fs';
import path from 'node:path';

function runMigrations() {
  const migrationDir = path.resolve(__dirname, 'migrations');
  const migrationFiles = fs.readdirSync(migrationDir).sort();

  db.exec('BEGIN TRANSACTION;');
  console.log('Starting database migrations...');
  try {
    migrationFiles.forEach((file) => {
      const filePath = path.join(migrationDir, file);
      const sql = fs.readFileSync(filePath, 'utf-8');
      db.exec(sql);
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
