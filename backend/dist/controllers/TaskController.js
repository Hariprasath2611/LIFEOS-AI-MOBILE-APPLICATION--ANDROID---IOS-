"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskController = exports.TaskController = void 0;
const TaskService_1 = require("../services/TaskService");
class TaskController {
    async getTasks(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const tasks = await TaskService_1.taskService.getTasks(req.user.uid);
            res.json(tasks);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch tasks' });
        }
    }
    async createTask(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const task = await TaskService_1.taskService.createTask(req.user.uid, req.body);
            res.status(201).json(task);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to create task' });
        }
    }
    async updateTask(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const { id } = req.params;
            const updated = await TaskService_1.taskService.updateTask(req.user.uid, id, req.body);
            if (!updated) {
                res.status(404).json({ error: 'Task not found' });
                return;
            }
            res.json(updated);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to update task' });
        }
    }
    async deleteTask(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const { id } = req.params;
            const deleted = await TaskService_1.taskService.deleteTask(req.user.uid, id);
            if (!deleted) {
                res.status(404).json({ error: 'Task not found' });
                return;
            }
            res.json({ success: true });
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to delete task' });
        }
    }
    async runSmartPrioritization(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const analysis = await TaskService_1.taskService.runSmartPrioritization(req.user.uid);
            res.json(analysis);
        }
        catch (error) {
            console.error('Smart task prioritization failed:', error);
            res.status(500).json({ error: 'AI task prioritization failed' });
        }
    }
}
exports.TaskController = TaskController;
exports.taskController = new TaskController();
//# sourceMappingURL=TaskController.js.map