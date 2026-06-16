"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const errorMiddleware = (err, req, res, next) => {
    console.error('[Global Error Handler]:', err);
    const status = err.status || err.statusCode || 500;
    const message = err.message || 'An unexpected error occurred';
    res.status(status).json({
        error: {
            message,
            status,
            timestamp: new Date().toISOString(),
        },
    });
};
exports.errorMiddleware = errorMiddleware;
//# sourceMappingURL=errorMiddleware.js.map