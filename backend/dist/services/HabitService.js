"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.habitService = exports.HabitService = void 0;
const repositories_1 = require("../repositories");
const GeminiService_1 = require("./GeminiService");
const UserService_1 = require("./UserService");
class HabitService {
    async createHabit(userId, habitData) {
        const habit = await repositories_1.habitRepo.create({ ...habitData, userId });
        // Auto-generate tips from AI
        const suggestions = await GeminiService_1.geminiService.suggestHabits([habit.category], [habit.title]);
        if (suggestions && suggestions.recommendations && suggestions.recommendations.length > 0) {
            habit.aiSuggestions = suggestions.recommendations.map((r) => `${r.title}: ${r.rationale}`);
            await habit.save();
        }
        return habit;
    }
    async getHabits(userId) {
        return repositories_1.habitRepo.findByUserId(userId);
    }
    async toggleHabitCompletion(userId, habitId, dateStr) {
        const habit = await repositories_1.habitRepo.findOne({ _id: habitId, userId });
        if (!habit)
            return null;
        const targetDate = new Date(dateStr);
        targetDate.setHours(0, 0, 0, 0);
        const index = habit.history.findIndex(d => {
            const hd = new Date(d);
            hd.setHours(0, 0, 0, 0);
            return hd.getTime() === targetDate.getTime();
        });
        if (index >= 0) {
            // Remove completion (toggle off)
            habit.history.splice(index, 1);
        }
        else {
            // Mark complete (toggle on)
            habit.history.push(targetDate);
            await UserService_1.userService.incrementProductivityScore(userId, 3);
        }
        // Calculate streaks
        habit.streak = this.calculateStreak(habit.history, habit.frequency);
        await habit.save();
        return habit;
    }
    async deleteHabit(userId, habitId) {
        const result = await repositories_1.habitRepo.delete({ _id: habitId, userId });
        return result.deletedCount > 0;
    }
    calculateStreak(history, frequency) {
        if (history.length === 0)
            return 0;
        // Sort completion dates descending
        const sorted = [...history].map(d => {
            const nd = new Date(d);
            nd.setHours(0, 0, 0, 0);
            return nd.getTime();
        }).sort((a, b) => b - a);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayMs = today.getTime();
        const oneDayMs = 24 * 60 * 60 * 1000;
        let streak = 0;
        let currentCheck = todayMs;
        // If today is not in sorted, check if yesterday is in sorted to continue streak
        if (!sorted.includes(todayMs)) {
            currentCheck = todayMs - oneDayMs;
            if (!sorted.includes(currentCheck)) {
                return 0; // Streak broken
            }
        }
        for (let i = 0; i < sorted.length; i++) {
            if (sorted.includes(currentCheck)) {
                streak++;
                // Move back one unit of frequency
                currentCheck -= (frequency === 'daily' ? oneDayMs : oneDayMs * 7);
            }
            else {
                break;
            }
        }
        return streak;
    }
}
exports.HabitService = HabitService;
exports.habitService = new HabitService();
//# sourceMappingURL=HabitService.js.map