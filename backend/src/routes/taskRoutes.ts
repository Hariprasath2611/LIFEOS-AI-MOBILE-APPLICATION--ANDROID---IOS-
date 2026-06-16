import { Router } from 'express';
import { taskController } from '../controllers/TaskController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/', taskController.getTasks);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.post('/prioritize', taskController.runSmartPrioritization);

export default router;
