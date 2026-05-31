import cors from 'cors';
import express from 'express';
import { logger } from './middleware/loggerMiddleware.js';
import { globalErrorHandler } from './middleware/errorMiddleware.js';
import apiRouter from './routes/index.js';
import AppError from './utils/AppError.js';
import authRoutes from './routes/authRoutes.js'; // Imported correctly
import campaignRoutes from './routes/campaignRoutes.js';
import discoveryRoutes from './routes/discoveryRoutes.js';
const app = express(); // 1. App is initialized first

// Global Middlewares
app.use(cors());
app.use(logger);
app.use(express.json()); // 2. JSON parser is initialized second (crucial for login/register)

// API Routes
app.use('/api/auth', authRoutes); // 3. Auth routes go here, after the JSON parser!
app.use('/api/campaigns', campaignRoutes);
app.use('/api/discover', discoveryRoutes);
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