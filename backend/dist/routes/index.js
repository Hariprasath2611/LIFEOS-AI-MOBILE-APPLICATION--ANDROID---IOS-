"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRoutes_1 = __importDefault(require("./userRoutes"));
const taskRoutes_1 = __importDefault(require("./taskRoutes"));
const goalRoutes_1 = __importDefault(require("./goalRoutes"));
const habitRoutes_1 = __importDefault(require("./habitRoutes"));
const noteRoutes_1 = __importDefault(require("./noteRoutes"));
const learningRoutes_1 = __importDefault(require("./learningRoutes"));
const analyticsRoutes_1 = __importDefault(require("./analyticsRoutes"));
const calendarRoutes_1 = __importDefault(require("./calendarRoutes"));
const notificationRoutes_1 = __importDefault(require("./notificationRoutes"));
const aiRoutes_1 = __importDefault(require("./aiRoutes"));
const router = (0, express_1.Router)();
// Register modules
router.use('/users', userRoutes_1.default);
router.use('/tasks', taskRoutes_1.default);
router.use('/goals', goalRoutes_1.default);
router.use('/habits', habitRoutes_1.default);
router.use('/notes', noteRoutes_1.default);
router.use('/learning', learningRoutes_1.default);
router.use('/analytics', analyticsRoutes_1.default);
router.use('/calendar', calendarRoutes_1.default);
router.use('/notifications', notificationRoutes_1.default);
router.use('/ai', aiRoutes_1.default);
// Add health status check
router.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});
exports.default = router;
//# sourceMappingURL=index.js.map