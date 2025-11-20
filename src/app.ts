import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { authRouter } from './routes/authRoutes';
import { fileRouter } from './routes/fileRoutes';
import { userRouter } from './routes/userRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true
  })
);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use(authRouter);
app.use('/file', fileRouter);
app.use('/', userRouter);

app.use(errorHandler);

export default app;

