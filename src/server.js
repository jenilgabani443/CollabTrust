import dotenv from 'dotenv';
import { connectDB } from './utils/db.js';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import Message from './models/Message.js';
//import './queues/verificationWorker.js';

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

    // Initialize socket.io bound to the HTTP server
    const io = new Server(server, {
      cors: {
        origin: '*',
      },
    });

    // Socket middleware for JWT verification before connection
    io.use((socket, next) => {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization;
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const jwtToken = token.startsWith('Bearer ') ? token.split(' ')[1] : token;

      try {
        const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
        socket.user = decoded;
        next();
      } catch (err) {
        return next(new Error('Authentication error: Invalid or expired token'));
      }
    });

    // Handle Socket connection and messaging events
    io.on('connection', (socket) => {
      console.log(`User connected to socket: ${socket.user.id}`);

      // Allow users to join a room named after their campaignId
      socket.on('join_campaign', (campaignId) => {
        if (!campaignId) {
          return socket.emit('error', 'Campaign ID is required to join a room.');
        }
        socket.join(campaignId);
        console.log(`User ${socket.user.id} joined room: ${campaignId}`);
      });

      // Handle sending messages with a regex interceptor
      socket.on('send_message', async (data) => {
        const { campaignId, text } = data;

        if (!campaignId || !text) {
          return socket.emit('error', 'Campaign ID and text are required to send a message.');
        }

        // Regex scan for emails, phone numbers, and restricted direct-pay keywords
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;
        const phoneRegex = /(\+?\d{1,4}[-.\s]??)?(\(?\d{2,4}\)?[-.\s]??)?\d{3,4}[-.\s]??\d{4,9}/g;
        const wordsRegex = /whatsapp|pay\s+me\s+directly|pay\s+directly/gi;

        let redactedText = text;
        let isRedacted = false;

        if (emailRegex.test(text) || phoneRegex.test(text) || wordsRegex.test(text)) {
          redactedText = text
            .replace(emailRegex, '***')
            .replace(phoneRegex, '***')
            .replace(wordsRegex, '***');
          isRedacted = true;
        }

        try {
          // Save redacted message to the Message collection
          const message = await Message.create({
            campaignId,
            senderId: socket.user.id,
            text: redactedText,
            isRedacted,
          });

          // Broadcast the redacted text to the campaign room
          io.to(campaignId).emit('receive_message', {
            id: message._id,
            campaignId,
            senderId: socket.user.id,
            text: redactedText,
            isRedacted,
            createdAt: message.createdAt,
          });
        } catch (err) {
          console.error('Error saving/broadcasting message:', err);
          socket.emit('error', 'Failed to send message.');
        }
      });

      socket.on('disconnect', () => {
        console.log(`User disconnected from socket: ${socket.user.id}`);
      });
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
