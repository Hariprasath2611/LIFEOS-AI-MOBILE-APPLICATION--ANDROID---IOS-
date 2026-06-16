"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const LearningController_1 = require("../controllers/LearningController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authMiddleware);
router.get('/', LearningController_1.learningController.getRoadmaps);
router.post('/generate', LearningController_1.learningController.generateRoadmap);
router.put('/:id/step', LearningController_1.learningController.updateStep);
router.delete('/:id', LearningController_1.learningController.deleteRoadmap);
exports.default = router;
//# sourceMappingURL=learningRoutes.js.map