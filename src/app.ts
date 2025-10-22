import express, { json } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import router from 'routes';
import { errorHandler } from 'shared/middlewares/error.middleware';

const app = express();

app.use(json());
app.use(cors());
app.use(helmet());

app.use('/api', router);
app.use(errorHandler);

export default app;
