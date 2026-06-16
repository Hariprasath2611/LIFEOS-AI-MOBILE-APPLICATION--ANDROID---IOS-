"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.learningController = exports.LearningController = void 0;
const LearningService_1 = require("../services/LearningService");
class LearningController {
    async getRoadmaps(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const roadmaps = await LearningService_1.learningService.getRoadmaps(req.user.uid);
            res.json(roadmaps);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch roadmaps' });
        }
    }
    async generateRoadmap(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const { topic, difficulty } = req.body;
            if (!topic || !difficulty) {
                res.status(400).json({ error: 'Topic and difficulty are required parameters' });
                return;
            }
            const roadmap = await LearningService_1.learningService.generateRoadmap(req.user.uid, topic, difficulty);
            res.status(201).json(roadmap);
        }
        catch (error) {
            console.error('Roadmap generation failed:', error);
            res.status(500).json({ error: 'Failed to generate learning roadmap' });
        }
    }
    async updateStep(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const { id } = req.params;
            const { stepTitle, completed } = req.body;
            if (!stepTitle || completed === undefined) {
                res.status(400).json({ error: 'StepTitle and completed boolean are required' });
                return;
            }
            const updated = await LearningService_1.learningService.updateStepProgress(req.user.uid, id, stepTitle, completed);
            if (!updated) {
                res.status(404).json({ error: 'Roadmap or step not found' });
                return;
            }
            res.json(updated);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to update step progress' });
        }
    }
    async deleteRoadmap(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const { id } = req.params;
            const deleted = await LearningService_1.learningService.deleteRoadmap(req.user.uid, id);
            if (!deleted) {
                res.status(404).json({ error: 'Roadmap not found' });
                return;
            }
            res.json({ success: true });
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to delete roadmap' });
        }
    }
}
exports.LearningController = LearningController;
exports.learningController = new LearningController();
//# sourceMappingURL=LearningController.js.map