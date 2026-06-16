import { Router } from 'express';
import { userController } from '../controllers/UserController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Apply authorization check across all user routes
router.use(authMiddleware);

router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.get('/dashboard', userController.getDashboardSummary);

export default router;
