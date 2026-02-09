import cors from 'cors';
import type { Application, Request, Response } from 'express';
import express from 'express';

const app: Application = express();

app.use(express.json());

app.use(
    cors({
        origin: 'http://localhost:5173', // Adjust this to your frontend URL
    })
);

// Main & Basic Route
app.get('/', (req: Request, res: Response) => {
    res.json({
        success: true,
        message: 'Welcome to the API',
    });
});

// Error handling middleware for 404 Not Found
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        error: 'Resource not found',
        message: 'Resource not found',
    });
});

export default app;
