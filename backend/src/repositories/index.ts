import { BaseRepository } from './BaseRepository';
import { User, IUser } from '../models/User';
import { Task, ITask } from '../models/Task';
import { Goal, IGoal } from '../models/Goal';
import { Habit, IHabit } from '../models/Habit';
import { Note, INote } from '../models/Note';
import { Conversation, IConversation } from '../models/Conversation';
import { Memory, IMemory } from '../models/Memory';
import { LearningRoadmap, ILearningRoadmap } from '../models/LearningRoadmap';
import { Analytics, IAnalytics } from '../models/Analytics';
import { Notification, INotification } from '../models/Notification';
import { CalendarEvent, ICalendarEvent } from '../models/CalendarEvent';

export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(User);
  }
  async findByUid(uid: string): Promise<IUser | null> {
    return this.findOne({ uid });
  }
}

export class TaskRepository extends BaseRepository<ITask> {
  constructor() {
    super(Task);
  }
  async findByUserId(userId: string): Promise<ITask[]> {
    return this.find({ userId }, { sort: { dueDate: 1, createdAt: -1 } });
  }
}

export class GoalRepository extends BaseRepository<IGoal> {
  constructor() {
    super(Goal);
  }
  async findByUserId(userId: string): Promise<IGoal[]> {
    return this.find({ userId }, { sort: { createdAt: -1 } });
  }
}

export class HabitRepository extends BaseRepository<IHabit> {
  constructor() {
    super(Habit);
  }
  async findByUserId(userId: string): Promise<IHabit[]> {
    return this.find({ userId }, { sort: { createdAt: -1 } });
  }
}

export class NoteRepository extends BaseRepository<INote> {
  constructor() {
    super(Note);
  }
  async findByUserId(userId: string): Promise<INote[]> {
    return this.find({ userId }, { sort: { updatedAt: -1 } });
  }
}

export class ConversationRepository extends BaseRepository<IConversation> {
  constructor() {
    super(Conversation);
  }
  async findByUserId(userId: string): Promise<IConversation[]> {
    return this.find({ userId }, { sort: { pinned: -1, updatedAt: -1 } });
  }
}

export class MemoryRepository extends BaseRepository<IMemory> {
  constructor() {
    super(Memory);
  }
  async findByConversationId(conversationId: string): Promise<IMemory[]> {
    return this.find({ conversationId }, { sort: { createdAt: 1 } });
  }
}

export class LearningRoadmapRepository extends BaseRepository<ILearningRoadmap> {
  constructor() {
    super(LearningRoadmap);
  }
  async findByUserId(userId: string): Promise<ILearningRoadmap[]> {
    return this.find({ userId }, { sort: { createdAt: -1 } });
  }
}

export class AnalyticsRepository extends BaseRepository<IAnalytics> {
  constructor() {
    super(Analytics);
  }
  async findByUserId(userId: string): Promise<IAnalytics[]> {
    return this.find({ userId }, { sort: { date: -1 } });
  }
  async findDaily(userId: string, date: Date): Promise<IAnalytics | null> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    return this.findOne({
      userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });
  }
}

export class NotificationRepository extends BaseRepository<INotification> {
  constructor() {
    super(Notification);
  }
  async findPending(userId: string): Promise<INotification[]> {
    return this.find({ userId, read: false, scheduledAt: { $lte: new Date() } }, { sort: { scheduledAt: -1 } });
  }
}

export class CalendarEventRepository extends BaseRepository<ICalendarEvent> {
  constructor() {
    super(CalendarEvent);
  }
  async findByRange(userId: string, start: Date, end: Date): Promise<ICalendarEvent[]> {
    return this.find({
      userId,
      start: { $gte: start },
      end: { $lte: end },
    }, { sort: { start: 1 } });
  }
}

export const userRepo = new UserRepository();
export const taskRepo = new TaskRepository();
export const goalRepo = new GoalRepository();
export const habitRepo = new HabitRepository();
export const noteRepo = new NoteRepository();
export const conversationRepo = new ConversationRepository();
export const memoryRepo = new MemoryRepository();
export const learningRoadmapRepo = new LearningRoadmapRepository();
export const analyticsRepo = new AnalyticsRepository();
export const notificationRepo = new NotificationRepository();
export const calendarEventRepo = new CalendarEventRepository();
