import mongoose from 'mongoose';

// Ensure Mongoose uses the default global Promise library
mongoose.Promise = global.Promise;

// Event Listeners for Connection State Monitoring
mongoose.connection.on('connecting', () => {
  console.log('MongoDB: Connecting to database...');
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB: Connection established successfully.');
});

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB: Connection error occurred: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB: Connection lost. Mongoose will try to reconnect automatically...');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB: Reestablished connection successfully.');
});

// Handle application termination signals to close database connections gracefully
const gracefulShutdown = async (msg, callback) => {
  try {
    await mongoose.connection.close();
    console.log(`MongoDB: Connection closed due to ${msg}`);
    callback();
  } catch (err) {
    console.error(`MongoDB: Error while closing connection during shutdown: ${err.message}`);
    callback();
  }
};

// Listen for process termination events
process.once('SIGUSR2', () => {
  gracefulShutdown('nodemon restart', () => {
    process.kill(process.pid, 'SIGUSR2');
  });
});

process.on('SIGINT', () => {
  gracefulShutdown('app termination', () => {
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  gracefulShutdown('app termination', () => {
    process.exit(0);
  });
});

/**
 * Connect to MongoDB database
 * @returns {Promise<typeof mongoose>} Mongoose connection instance
 */
export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    const errMessage = 'MONGODB_URI is not defined in environment variables.';
    console.error(`MongoDB Error: ${errMessage}`);
    throw new Error(errMessage);
  }

  const options = {
    maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE || '10', 10),
    minPoolSize: parseInt(process.env.MONGODB_MIN_POOL_SIZE || '2', 10),
    socketTimeoutMS: 45000,
    serverSelectionTimeoutMS: 5000,
  };

  try {
    const conn = await mongoose.connect(uri, options);
    return conn;
  } catch (error) {
    console.error(`MongoDB: Initial connection failed: ${error.message}`);
    throw error;
  }
};

export default mongoose;
