import express from 'express';
import { logger } from './middleware/loggerMiddleware.js';
import { globalErrorHandler } from './middleware/errorMiddleware.js';
import apiRouter from './routes/index.js';
import AppError from './utils/AppError.js';

const app = express();

// Global Middlewares
app.use(logger);                 // Custom request tracing logger
app.use(express.json());         // Parse incoming JSON request bodies

// API Routes
app.use('/api/v1', apiRouter);

// Base route test check
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to the Express Node.js application!',
  });
});

// Fallback Route Handler (Unhandled API endpoints)
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Centralized Error Handling Middleware
app.use(globalErrorHandler);

export default app;
