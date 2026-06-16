"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.goalController = exports.GoalController = void 0;
const GoalService_1 = require("../services/GoalService");
class GoalController {
    async getGoals(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const goals = await GoalService_1.goalService.getGoals(req.user.uid);
            res.json(goals);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch goals' });
        }
    }
    async createGoal(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const goal = await GoalService_1.goalService.createGoal(req.user.uid, req.body);
            res.status(201).json(goal);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to create goal' });
        }
    }
    async updateGoal(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const { id } = req.params;
            const updated = await GoalService_1.goalService.updateGoal(req.user.uid, id, req.body);
            if (!updated) {
                res.status(404).json({ error: 'Goal not found' });
                return;
            }
            res.json(updated);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to update goal' });
        }
    }
    async deleteGoal(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const { id } = req.params;
            const deleted = await GoalService_1.goalService.deleteGoal(req.user.uid, id);
            if (!deleted) {
                res.status(404).json({ error: 'Goal not found' });
                return;
            }
            res.json({ success: true });
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to delete goal' });
        }
    }
    async triggerAIActionPlan(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const { id } = req.params;
            const updatedGoal = await GoalService_1.goalService.triggerAIActionPlan(req.user.uid, id);
            if (!updatedGoal) {
                res.status(404).json({ error: 'Goal not found' });
                return;
            }
            res.json(updatedGoal);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to generate AI action plan' });
        }
    }
}
exports.GoalController = GoalController;
exports.goalController = new GoalController();
//# sourceMappingURL=GoalController.js.map