"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const routes_1 = __importDefault(require("./routes"));
const socket_1 = require("./socket");
const errorMiddleware_1 = require("./middlewares/errorMiddleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const PORT = process.env.PORT || 5000;
// Security and utility Middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: '*', // For development, allow all cross-origins. Restrict in production.
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// Apply basic rate limiting for API protection
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // limit each IP to 200 requests per windowMs
    message: { error: 'Too many requests from this IP, please try again later.' }
});
app.use('/api', limiter);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Register routes
app.use('/api', routes_1.default);
// Set up Socket.io server
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
(0, socket_1.setupSocketIO)(io);
// Global Error Handler Middleware
app.use(errorMiddleware_1.errorMiddleware);
// Boot server
const startServer = async () => {
    try {
        await (0, db_1.connectDB)();
        server.listen(PORT, () => {
            console.log(`=========================================`);
            console.log(`  LifeOS AI Server started on port ${PORT}`);
            console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`  API Base: http://localhost:${PORT}/api`);
            console.log(`=========================================`);
        });
    }
    catch (error) {
        console.error('Critical server crash during startup:', error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=index.js.map