"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const NotificationController_1 = require("../controllers/NotificationController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authMiddleware);
router.get('/', NotificationController_1.notificationController.getNotifications);
router.put('/:id/read', NotificationController_1.notificationController.markAsRead);
router.post('/read-all', NotificationController_1.notificationController.markAllAsRead);
exports.default = router;
//# sourceMappingURL=notificationRoutes.js.map