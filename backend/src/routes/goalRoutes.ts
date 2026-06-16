import { Router } from 'express';
import { goalController } from '../controllers/GoalController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/', goalController.getGoals);
router.post('/', goalController.createGoal);
router.put('/:id', goalController.updateGoal);
router.delete('/:id', goalController.deleteGoal);
router.post('/:id/action-plan', goalController.triggerAIActionPlan);

export default router;
