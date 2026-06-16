import { habitRepo } from '../repositories';
import { IHabit } from '../models/Habit';
import { geminiService } from './GeminiService';
import { userService } from './UserService';

export class HabitService {
  async createHabit(userId: string, habitData: Partial<IHabit>): Promise<IHabit> {
    const habit = await habitRepo.create({ ...habitData, userId });
    
    // Auto-generate tips from AI
    const suggestions = await geminiService.suggestHabits([habit.category], [habit.title]);
    if (suggestions && suggestions.recommendations && suggestions.recommendations.length > 0) {
      habit.aiSuggestions = suggestions.recommendations.map((r: any) => `${r.title}: ${r.rationale}`);
      await habit.save();
    }

    return habit;
  }

  async getHabits(userId: string): Promise<IHabit[]> {
    return habitRepo.findByUserId(userId);
  }

  async toggleHabitCompletion(userId: string, habitId: string, dateStr: string): Promise<IHabit | null> {
    const habit = await habitRepo.findOne({ _id: habitId, userId });
    if (!habit) return null;

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
    } else {
      // Mark complete (toggle on)
      habit.history.push(targetDate);
      await userService.incrementProductivityScore(userId, 3);
    }

    // Calculate streaks
    habit.streak = this.calculateStreak(habit.history, habit.frequency);
    await habit.save();
    return habit;
  }

  async deleteHabit(userId: string, habitId: string): Promise<boolean> {
    const result = await habitRepo.delete({ _id: habitId, userId });
    return result.deletedCount > 0;
  }

  private calculateStreak(history: Date[], frequency: 'daily' | 'weekly'): number {
    if (history.length === 0) return 0;

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
      } else {
        break;
      }
    }

    return streak;
  }
}

export const habitService = new HabitService();
