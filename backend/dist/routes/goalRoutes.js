"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const GoalController_1 = require("../controllers/GoalController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authMiddleware);
router.get('/', GoalController_1.goalController.getGoals);
router.post('/', GoalController_1.goalController.createGoal);
router.put('/:id', GoalController_1.goalController.updateGoal);
router.delete('/:id', GoalController_1.goalController.deleteGoal);
router.post('/:id/action-plan', GoalController_1.goalController.triggerAIActionPlan);
exports.default = router;
//# sourceMappingURL=goalRoutes.js.map