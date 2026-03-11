import dotenv from 'dotenv';
import type { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';

dotenv.config();

let server: Server;

const PORT = process.env.PORT || 3000;
const URL = process.env.URL as string;

async function startServer() {
    try {
        await mongoose.connect(URL);
        console.log('Connected to MongoDB');
        server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('An error Occurred:', error);
    }
}

startServer();
