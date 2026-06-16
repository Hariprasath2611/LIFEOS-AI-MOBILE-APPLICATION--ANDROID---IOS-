import { Router } from 'express';
import { habitController } from '../controllers/HabitController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/', habitController.getHabits);
router.post('/', habitController.createHabit);
router.post('/:id/toggle', habitController.toggleHabit);
router.delete('/:id', habitController.deleteHabit);

export default router;
