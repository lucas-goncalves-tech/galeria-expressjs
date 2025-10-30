import express, { json } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from 'shared/middlewares/error.middleware';
import router from 'routes';
import { runMigrations } from 'database/migrate';
import { loggerMiddleware } from 'shared/middlewares/logger.middleware';

class App {
  public server: express.Application;

  constructor() {
    this.server = express();

    this.runDbMigrations();
    this.middlewares();
    this.routes();
    this.handleErrors();
  }

  private runDbMigrations() {
    try {
      runMigrations();
    } catch (error) {
      console.error('Failed to run database migrations:', error);
      process.exit(1);
    }
  }

  private middlewares() {
    this.server.use(helmet());
    this.server.use(cors());
    this.server.use(json());
    this.server.use(loggerMiddleware);
  }

  private routes() {
    this.server.use('/api/v1/', router);
  }

  private handleErrors() {
    this.server.use(errorHandler);
  }
}

export default new App().server;
