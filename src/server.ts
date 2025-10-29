import 'shared/config/env.config';
import app from 'app';
import { db } from 'database/connection';

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

  setTimeout(() => {
    console.error('❌ Desligamento forçado devido ao timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
