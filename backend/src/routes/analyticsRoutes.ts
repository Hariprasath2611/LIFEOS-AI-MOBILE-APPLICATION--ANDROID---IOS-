import { Router } from 'express';
import { analyticsController } from '../controllers/AnalyticsController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/', analyticsController.getAnalyticsHistory);
router.post('/compute', analyticsController.computeAnalytics);

export default router;
