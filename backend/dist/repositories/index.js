"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calendarEventRepo = exports.notificationRepo = exports.analyticsRepo = exports.learningRoadmapRepo = exports.memoryRepo = exports.conversationRepo = exports.noteRepo = exports.habitRepo = exports.goalRepo = exports.taskRepo = exports.userRepo = exports.CalendarEventRepository = exports.NotificationRepository = exports.AnalyticsRepository = exports.LearningRoadmapRepository = exports.MemoryRepository = exports.ConversationRepository = exports.NoteRepository = exports.HabitRepository = exports.GoalRepository = exports.TaskRepository = exports.UserRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
const User_1 = require("../models/User");
const Task_1 = require("../models/Task");
const Goal_1 = require("../models/Goal");
const Habit_1 = require("../models/Habit");
const Note_1 = require("../models/Note");
const Conversation_1 = require("../models/Conversation");
const Memory_1 = require("../models/Memory");
const LearningRoadmap_1 = require("../models/LearningRoadmap");
const Analytics_1 = require("../models/Analytics");
const Notification_1 = require("../models/Notification");
const CalendarEvent_1 = require("../models/CalendarEvent");
class UserRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(User_1.User);
    }
    async findByUid(uid) {
        return this.findOne({ uid });
    }
}
exports.UserRepository = UserRepository;
class TaskRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Task_1.Task);
    }
    async findByUserId(userId) {
        return this.find({ userId }, { sort: { dueDate: 1, createdAt: -1 } });
    }
}
exports.TaskRepository = TaskRepository;
class GoalRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Goal_1.Goal);
    }
    async findByUserId(userId) {
        return this.find({ userId }, { sort: { createdAt: -1 } });
    }
}
exports.GoalRepository = GoalRepository;
class HabitRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Habit_1.Habit);
    }
    async findByUserId(userId) {
        return this.find({ userId }, { sort: { createdAt: -1 } });
    }
}
exports.HabitRepository = HabitRepository;
class NoteRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Note_1.Note);
    }
    async findByUserId(userId) {
        return this.find({ userId }, { sort: { updatedAt: -1 } });
    }
}
exports.NoteRepository = NoteRepository;
class ConversationRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Conversation_1.Conversation);
    }
    async findByUserId(userId) {
        return this.find({ userId }, { sort: { pinned: -1, updatedAt: -1 } });
    }
}
exports.ConversationRepository = ConversationRepository;
class MemoryRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Memory_1.Memory);
    }
    async findByConversationId(conversationId) {
        return this.find({ conversationId }, { sort: { createdAt: 1 } });
    }
}
exports.MemoryRepository = MemoryRepository;
class LearningRoadmapRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(LearningRoadmap_1.LearningRoadmap);
    }
    async findByUserId(userId) {
        return this.find({ userId }, { sort: { createdAt: -1 } });
    }
}
exports.LearningRoadmapRepository = LearningRoadmapRepository;
class AnalyticsRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Analytics_1.Analytics);
    }
    async findByUserId(userId) {
        return this.find({ userId }, { sort: { date: -1 } });
    }
    async findDaily(userId, date) {
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
exports.AnalyticsRepository = AnalyticsRepository;
class NotificationRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Notification_1.Notification);
    }
    async findPending(userId) {
        return this.find({ userId, read: false, scheduledAt: { $lte: new Date() } }, { sort: { scheduledAt: -1 } });
    }
}
exports.NotificationRepository = NotificationRepository;
class CalendarEventRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(CalendarEvent_1.CalendarEvent);
    }
    async findByRange(userId, start, end) {
        return this.find({
            userId,
            start: { $gte: start },
            end: { $lte: end },
        }, { sort: { start: 1 } });
    }
}
exports.CalendarEventRepository = CalendarEventRepository;
exports.userRepo = new UserRepository();
exports.taskRepo = new TaskRepository();
exports.goalRepo = new GoalRepository();
exports.habitRepo = new HabitRepository();
exports.noteRepo = new NoteRepository();
exports.conversationRepo = new ConversationRepository();
exports.memoryRepo = new MemoryRepository();
exports.learningRoadmapRepo = new LearningRoadmapRepository();
exports.analyticsRepo = new AnalyticsRepository();
exports.notificationRepo = new NotificationRepository();
exports.calendarEventRepo = new CalendarEventRepository();
//# sourceMappingURL=index.js.map