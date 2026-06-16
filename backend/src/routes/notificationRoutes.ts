import { Router } from 'express';
import { notificationController } from '../controllers/NotificationController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/', notificationController.getNotifications);
router.put('/:id/read', notificationController.markAsRead);
router.post('/read-all', notificationController.markAllAsRead);

export default router;
