"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.habitController = exports.HabitController = void 0;
const HabitService_1 = require("../services/HabitService");
class HabitController {
    async getHabits(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const habits = await HabitService_1.habitService.getHabits(req.user.uid);
            res.json(habits);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch habits' });
        }
    }
    async createHabit(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const habit = await HabitService_1.habitService.createHabit(req.user.uid, req.body);
            res.status(201).json(habit);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to create habit' });
        }
    }
    async toggleHabit(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const { id } = req.params;
            const { date } = req.body; // Expect ISO string or date representation
            if (!date) {
                res.status(400).json({ error: 'Date is required for toggle check-in' });
                return;
            }
            const updated = await HabitService_1.habitService.toggleHabitCompletion(req.user.uid, id, date);
            if (!updated) {
                res.status(404).json({ error: 'Habit not found' });
                return;
            }
            res.json(updated);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to toggle habit completion' });
        }
    }
    async deleteHabit(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const { id } = req.params;
            const deleted = await HabitService_1.habitService.deleteHabit(req.user.uid, id);
            if (!deleted) {
                res.status(404).json({ error: 'Habit not found' });
                return;
            }
            res.json({ success: true });
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to delete habit' });
        }
    }
}
exports.HabitController = HabitController;
exports.habitController = new HabitController();
//# sourceMappingURL=HabitController.js.map