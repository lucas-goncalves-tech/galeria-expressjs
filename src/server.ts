import app from 'app';
import { configDotenv } from 'dotenv';
import { runMigrations } from 'database/migrate';
import { db } from 'database/connection';

runMigrations();
configDotenv({
  path: process.env.NODE_ENV === 'production' ? '.env' : '.env.local',
});
const PORT = process.env.PORT || 3333;

const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

const gracefulShutdown = (signal: string) => {
  console.log(`Recebido sinal ${signal}. Finalizando o servidor...`);
  db.close();
  server.close(() => {
    console.log('Servidor finalizado com sucesso.');
    process.exit(0);
  });
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
