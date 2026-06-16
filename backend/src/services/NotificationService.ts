import { notificationRepo } from '../repositories';
import { INotification } from '../models/Notification';

export class NotificationService {
  async getNotifications(userId: string): Promise<INotification[]> {
    return notificationRepo.find({ userId }, { sort: { createdAt: -1 } });
  }

  async getPendingNotifications(userId: string): Promise<INotification[]> {
    return notificationRepo.findPending(userId);
  }

  async markAsRead(userId: string, notificationId: string): Promise<INotification | null> {
    return notificationRepo.update({ _id: notificationId, userId }, { read: true });
  }

  async markAllAsRead(userId: string): Promise<void> {
    const notifications = await notificationRepo.find({ userId, read: false });
    for (const notif of notifications) {
      notif.read = true;
      await notif.save();
    }
  }

  async scheduleNotification(
    userId: string,
    title: string,
    body: string,
    type: 'reminder' | 'recommendation' | 'chat',
    scheduledAt: Date = new Date()
  ): Promise<INotification> {
    const notif = await notificationRepo.create({
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

export const notificationService = new NotificationService();
