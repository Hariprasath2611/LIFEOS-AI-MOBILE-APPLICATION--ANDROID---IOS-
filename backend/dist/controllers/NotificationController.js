"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationController = exports.NotificationController = void 0;
const NotificationService_1 = require("../services/NotificationService");
class NotificationController {
    async getNotifications(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const notifications = await NotificationService_1.notificationService.getNotifications(req.user.uid);
            res.json(notifications);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch notifications' });
        }
    }
    async markAsRead(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const { id } = req.params;
            const updated = await NotificationService_1.notificationService.markAsRead(req.user.uid, id);
            if (!updated) {
                res.status(404).json({ error: 'Notification not found' });
                return;
            }
            res.json(updated);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to update notification' });
        }
    }
    async markAllAsRead(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            await NotificationService_1.notificationService.markAllAsRead(req.user.uid);
            res.json({ success: true });
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to dismiss notifications' });
        }
    }
}
exports.NotificationController = NotificationController;
exports.notificationController = new NotificationController();
//# sourceMappingURL=NotificationController.js.map