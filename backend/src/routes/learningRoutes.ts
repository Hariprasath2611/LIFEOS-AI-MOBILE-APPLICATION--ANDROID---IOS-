import { Router } from 'express';
import { learningController } from '../controllers/LearningController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/', learningController.getRoadmaps);
router.post('/generate', learningController.generateRoadmap);
router.put('/:id/step', learningController.updateStep);
router.delete('/:id', learningController.deleteRoadmap);

export default router;
