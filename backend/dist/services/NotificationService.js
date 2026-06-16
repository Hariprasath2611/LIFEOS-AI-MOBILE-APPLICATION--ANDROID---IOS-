"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationService = exports.NotificationService = void 0;
const repositories_1 = require("../repositories");
class NotificationService {
    async getNotifications(userId) {
        return repositories_1.notificationRepo.find({ userId }, { sort: { createdAt: -1 } });
    }
    async getPendingNotifications(userId) {
        return repositories_1.notificationRepo.findPending(userId);
    }
    async markAsRead(userId, notificationId) {
        return repositories_1.notificationRepo.update({ _id: notificationId, userId }, { read: true });
    }
    async markAllAsRead(userId) {
        const notifications = await repositories_1.notificationRepo.find({ userId, read: false });
        for (const notif of notifications) {
            notif.read = true;
            await notif.save();
        }
    }
    async scheduleNotification(userId, title, body, type, scheduledAt = new Date()) {
        const notif = await repositories_1.notificationRepo.create({
            userId,
            title,
            body,
            type,
            read: false,
            scheduledAt
        });
        // In a real production environment, you would integrate Firebase Cloud Messaging (FCM)
        // or Expo Push Services here to deliver push payloads to the mobile app.
        console.log(`[Push Notification Scheduled] User: ${userId} | Title: "${title}" | Scheduled: ${scheduledAt}`);
        return notif;
    }
}
exports.NotificationService = NotificationService;
exports.notificationService = new NotificationService();
//# sourceMappingURL=NotificationService.js.map