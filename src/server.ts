import app from 'app';
import { configDotenv } from 'dotenv';

configDotenv();
const PORT = process.env.PORT || 3333;

const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

const gracefulShutdown = (signal: string) => {
  console.log(`Recebido sinal ${signal}. Finalizando o servidor...`);
  server.close(() => {
    console.log('Servidor finalizado com sucesso.');
    process.exit(0);
  });
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
