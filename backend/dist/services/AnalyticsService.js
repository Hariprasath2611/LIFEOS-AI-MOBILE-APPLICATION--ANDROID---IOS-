"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsService = exports.AnalyticsService = void 0;
const repositories_1 = require("../repositories");
const GeminiService_1 = require("./GeminiService");
class AnalyticsService {
    async getAnalyticsHistory(userId) {
        return repositories_1.analyticsRepo.findByUserId(userId);
    }
    /**
     * Summarizes daily stats and updates/saves the current day's analytics record.
     */
    async computeDailyAnalytics(userId, date = new Date()) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        // 1. Count completed tasks
        const tasksCompleted = await repositories_1.taskRepo.count({
            userId,
            status: 'done',
            updatedAt: { $gte: startOfDay, $lte: endOfDay }
        });
        // 2. Count completed goals
        const goalsAchieved = await repositories_1.goalRepo.count({
            userId,
            progress: 100,
            updatedAt: { $gte: startOfDay, $lte: endOfDay }
        });
        // 3. Count habits completed
        const habits = await repositories_1.habitRepo.find({ userId });
        let completedHabitsCount = 0;
        habits.forEach(h => {
            const completedToday = h.history.some(historyDate => {
                const d = new Date(historyDate);
                return d.getTime() >= startOfDay.getTime() && d.getTime() <= endOfDay.getTime();
            });
            if (completedToday)
                completedHabitsCount++;
        });
        const totalHabits = habits.length;
        const habitConsistency = totalHabits > 0 ? Math.round((completedHabitsCount / totalHabits) * 100) : 0;
        // 4. Calculate focus & productivity score
        // Basic algorithm: weighted average of completed habits, tasks completed, and overall goals progress
        const taskScore = Math.min(100, tasksCompleted * 20); // 5 tasks = 100%
        const habitScore = habitConsistency;
        const goalScore = goalsAchieved > 0 ? 100 : 50; // Simple fallback weight
        const focusScore = Math.round((taskScore * 0.4) + (habitScore * 0.4) + (goalScore * 0.2));
        // Retrieve base user productivityScore (accumulated via level up)
        const user = await repositories_1.userRepo.findByUid(userId);
        const userBaseProductivity = user ? user.productivityScore : 50;
        // Overall daily productivity score is composite of base progress and today's achievements
        const productivityScore = Math.round((focusScore * 0.7) + (userBaseProductivity * 0.3));
        // 5. Check if daily analytics record already exists, update or create it
        let record = await repositories_1.analyticsRepo.findDaily(userId, date);
        if (!record) {
            record = await repositories_1.analyticsRepo.create({
                userId,
                date: startOfDay,
                tasksCompleted,
                goalsAchieved,
                habitConsistency,
                focusScore,
                productivityScore,
            });
        }
        else {
            record.tasksCompleted = tasksCompleted;
            record.goalsAchieved = goalsAchieved;
            record.habitConsistency = habitConsistency;
            record.focusScore = focusScore;
            record.productivityScore = productivityScore;
        }
        // 6. Generate AI Life Coaching insights if not generated yet, or if stats changed
        if (!record.aiInsights) {
            const metricsSummary = {
                tasksCompleted,
                goalsAchieved,
                habitConsistency,
                focusScore,
                productivityScore
            };
            const insights = await GeminiService_1.geminiService.runLifeCoaching(metricsSummary);
            record.aiInsights = insights;
        }
        await record.save();
        return record;
    }
}
exports.AnalyticsService = AnalyticsService;
exports.analyticsService = new AnalyticsService();
//# sourceMappingURL=AnalyticsService.js.map