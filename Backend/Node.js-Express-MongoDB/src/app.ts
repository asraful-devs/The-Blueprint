import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Request, Response, urlencoded } from 'express';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler.js';
import notFound from './app/middlewares/notFound.js';
import { router } from './app/routes/index.routes.js';

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    })
);

app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the Tour Management API');
});

app.use(globalErrorHandler);

app.use(notFound);

export default app;
