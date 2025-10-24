import express, { json } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from 'shared/middlewares/error.middleware';
import router from 'routes';
const app = express();

app.use(json());
app.use(cors());
app.use(helmet());

app.use('/api/v1', router);
app.use(errorHandler);

export default app;
