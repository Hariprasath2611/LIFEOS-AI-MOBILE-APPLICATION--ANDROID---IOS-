"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TaskController_1 = require("../controllers/TaskController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authMiddleware);
router.get('/', TaskController_1.taskController.getTasks);
router.post('/', TaskController_1.taskController.createTask);
router.put('/:id', TaskController_1.taskController.updateTask);
router.delete('/:id', TaskController_1.taskController.deleteTask);
router.post('/prioritize', TaskController_1.taskController.runSmartPrioritization);
exports.default = router;
//# sourceMappingURL=taskRoutes.js.map