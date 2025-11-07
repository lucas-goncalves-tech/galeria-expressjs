import { db } from './connection';
import fs from 'node:fs';
import path from 'node:path';

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
  console.log('Iniciando migrations no banco de dados...');
  try {
    migrationFiles.forEach((file) => {
      const allrunMigrationsStmt = db.prepare(
        'SELECT * FROM migrations WHERE name = ?',
      );
      const alreadyRun = allrunMigrationsStmt.get(file);
      if (alreadyRun) {
        console.log(`Pulando migration ja executada: ${file}`);
        return;
      }

      const filePath = path.join(migrationDir, file);
      const sql = fs.readFileSync(filePath, 'utf-8');
      db.exec(sql);
      const insertMigration = db.prepare(
        'INSERT INTO migrations (name) VALUES (?)',
      );
      insertMigration.run(file);
      console.log(`Migration executada: ${file}`);
    });
    db.exec('COMMIT;');
    console.log('Migration no banco de dados concluida.');
  } catch (error) {
    db.exec('ROLLBACK;');
    console.log('Erro durante migrations, rollback iniciado.', error);
    process.exit(1);
  }
}

export { runMigrations };
