import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { connectDB } from './config/db';
import apiRouter from './routes';
import { setupSocketIO } from './socket';
import { errorMiddleware } from './middlewares/errorMiddleware';

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Security and utility Middlewares
app.use(helmet());
app.use(cors({
  origin: '*', // For development, allow all cross-origins. Restrict in production.
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Apply basic rate limiting for API protection
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  message: { error: 'Too many requests from this IP, please try again later.' }
});
app.use('/api', limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register routes
app.use('/api', apiRouter);

// Set up Socket.io server
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
setupSocketIO(io);

// Global Error Handler Middleware
app.use(errorMiddleware);

// Boot server
const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`=========================================`);
      console.log(`  LifeOS AI Server started on port ${PORT}`);
      console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`  API Base: http://localhost:${PORT}/api`);
      console.log(`=========================================`);
    });
  } catch (error) {
    console.error('Critical server crash during startup:', error);
    process.exit(1);
  }
};

startServer();
