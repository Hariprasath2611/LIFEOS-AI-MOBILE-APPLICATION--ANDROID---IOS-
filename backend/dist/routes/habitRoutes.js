"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const HabitController_1 = require("../controllers/HabitController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authMiddleware);
router.get('/', HabitController_1.habitController.getHabits);
router.post('/', HabitController_1.habitController.createHabit);
router.post('/:id/toggle', HabitController_1.habitController.toggleHabit);
router.delete('/:id', HabitController_1.habitController.deleteHabit);
exports.default = router;
//# sourceMappingURL=habitRoutes.js.map