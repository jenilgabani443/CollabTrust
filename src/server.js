import dotenv from 'dotenv';
import { connectDB } from './utils/db.js';

// 1. Listen for Uncaught Exceptions (synchronous errors that are completely uncaught)
// These should be registered first before running/loading other modules
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, ':', err.message);
  if (err.stack) console.error(err.stack);
  process.exit(1);
});

// 2. Load environment configuration
dotenv.config();

// Import Express application (imported after dotenv config to ensure it has variables loaded)
import app from './app.js';

const port = process.env.PORT || 3000;
let server;

// Connect to MongoDB and then start the server
const startServer = async () => {
  try {
    await connectDB();
    server = app.listen(port, () => {
      console.log(`Application is running on port ${port} in ${process.env.NODE_ENV || 'development'} mode...`);
    });
  } catch (err) {
    console.error('CRITICAL: Server failed to start due to database connection error.');
    process.exit(1);
  }
};

startServer();

// 3. Listen for Unhandled Promise Rejections (asynchronous errors that are not caught)
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down gracefully...');
  console.error(err.name, ':', err.message);
  if (err.stack) console.error(err.stack);

  // Close the server and then exit the process
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});
