/* eslint-disable no-console */
import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app.js';
import { envVars } from './app/config/env.js';
import { sendSuperAdmin } from './app/utils/sendSuperAdmin.js';

let server: Server;

// Function to start the server and connect to MongoDB
const startServer = async () => {
    try {
        await mongoose.connect(envVars.MONGODB_URL);
        console.log('Connected to MongoDB');
        server = app.listen(envVars.PORT, () => {
            console.log(
                `Server is running on http://localhost:${envVars.PORT}`
            );
        });
    } catch (error) {
        console.error('Error starting server:', error);
    }
};

(async () => {
    await startServer();
    await sendSuperAdmin();
})();

// Handle unhandled promise rejections and uncaught exceptions
process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection. Shutting down server...', error);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception. Shutting down server...', error);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
});

// Handle graceful shutdown on SIGTERM and SIGINT signals
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received. Shutting down gracefully...');
    if (server) {
        server.close(() => {
            console.log('Server closed gracefully');
            process.exit(0);
        });
    } else {
        process.exit(0);
    }
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received. Shutting down gracefully...');
    if (server) {
        server.close(() => {
            console.log('Server closed gracefully');
            process.exit(0);
        });
    } else {
        process.exit(0);
    }
});
