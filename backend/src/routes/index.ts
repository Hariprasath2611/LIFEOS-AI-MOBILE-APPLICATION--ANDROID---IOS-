import { Router } from 'express';
import userRoutes from './userRoutes';
import taskRoutes from './taskRoutes';
import goalRoutes from './goalRoutes';
import habitRoutes from './habitRoutes';
import noteRoutes from './noteRoutes';
import learningRoutes from './learningRoutes';
import analyticsRoutes from './analyticsRoutes';
import calendarRoutes from './calendarRoutes';
import notificationRoutes from './notificationRoutes';
import aiRoutes from './aiRoutes';

const router = Router();

// Register modules
router.use('/users', userRoutes);
router.use('/tasks', taskRoutes);
router.use('/goals', goalRoutes);
router.use('/habits', habitRoutes);
router.use('/notes', noteRoutes);
router.use('/learning', learningRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/calendar', calendarRoutes);
router.use('/notifications', notificationRoutes);
router.use('/ai', aiRoutes);

// Add health status check
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

export default router;
