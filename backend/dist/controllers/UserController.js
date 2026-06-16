"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = exports.UserController = void 0;
const UserService_1 = require("../services/UserService");
const repositories_1 = require("../repositories");
class UserController {
    async getProfile(req, res) {
        try {
            if (!req.user) {
                res.status(404).json({ error: 'User profile not found' });
                return;
            }
            res.json(req.user);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch user profile' });
        }
    }
    async updateProfile(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const updatedUser = await UserService_1.userService.updateUser(req.user.uid, req.body);
            res.json(updatedUser);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to update user profile' });
        }
    }
    /**
     * Aggregates stats across collections to build the Home Dashboard summary.
     */
    async getDashboardSummary(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = req.user.uid;
            // Fetch active tasks
            const allTasks = await repositories_1.taskRepo.findByUserId(userId);
            const upcomingTasks = allTasks.filter(t => t.status !== 'done').slice(0, 5);
            const tasksCompletedToday = allTasks.filter(t => {
                if (t.status !== 'done')
                    return false;
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return new Date(t.updatedAt).getTime() >= today.getTime();
            }).length;
            // Habits summary
            const habits = await repositories_1.habitRepo.findByUserId(userId);
            const totalHabits = habits.length;
            const longestStreak = habits.reduce((max, h) => (h.streak > max ? h.streak : max), 0);
            // Goals progress
            const goals = await repositories_1.goalRepo.findByUserId(userId);
            const activeGoals = goals.filter(g => g.progress < 100);
            const overallGoalProgress = goals.length > 0
                ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length)
                : 0;
            // Roadmaps
            const roadmaps = await repositories_1.learningRoadmapRepo.findByUserId(userId);
            const activeRoadmaps = roadmaps.filter(r => r.progress < 100);
            res.json({
                productivityScore: req.user.productivityScore || 0,
                focusScore: Math.min(100, (tasksCompletedToday * 20) + (longestStreak * 5)),
                tasks: {
                    upcoming: upcomingTasks,
                    completedToday: tasksCompletedToday,
                },
                habits: {
                    total: totalHabits,
                    longestStreak,
                },
                goals: {
                    activeCount: activeGoals.length,
                    overallProgress: overallGoalProgress,
                },
                learning: {
                    activeCount: activeRoadmaps.length,
                },
                aiSuggestions: [
                    'Tackle your highest priority tasks first to clear your mind.',
                    longestStreak > 0
                        ? `Keep up your streak! You are maintaining an active habit chain.`
                        : 'Forming a new habit? Schedule it alongside an existing routine for habit stacking.',
                ]
            });
        }
        catch (error) {
            console.error('Failed to aggregate dashboard summary:', error);
            res.status(500).json({ error: 'Failed to compile dashboard summary' });
        }
    }
}
exports.UserController = UserController;
exports.userController = new UserController();
//# sourceMappingURL=UserController.js.map