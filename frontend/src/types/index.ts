export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  interests: string[];
  goals: string[];
  learningTopics: string[];
  productivityScore: number;
  preferences: {
    notificationsEnabled: boolean;
    aiAssistantEnabled: boolean;
    theme: 'dark' | 'light';
  };
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'done';
  category: string;
  dueDate?: string;
  recurrence: 'none' | 'daily' | 'weekly' | 'monthly';
  aiPrioritized: boolean;
  suggestedByAI: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  _id?: string;
  title: string;
  completed: boolean;
}

export interface Goal {
  _id: string;
  title: string;
  description?: string;
  type: 'short-term' | 'long-term';
  milestones: Milestone[];
  progress: number;
  targetDate?: string;
  aiActionPlan: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Habit {
  _id: string;
  title: string;
  category: string;
  frequency: 'daily' | 'weekly';
  history: string[]; // completion dates ISO strings
  streak: number;
  aiSuggestions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface NoteAttachment {
  type: 'image' | 'audio' | 'document';
  url: string;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  folder: string;
  attachments: NoteAttachment[];
  isFavorite: boolean;
  aiSummary?: string;
  aiTags: string[];
  aiInsights?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  _id: string;
  title: string;
  pinned: boolean;
  summary?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Memory {
  _id: string;
  conversationId: string;
  sender: 'user' | 'ai';
  content: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface RoadmapStep {
  title: string;
  duration: string;
  content: string;
  completed: boolean;
}

export interface LearningRoadmap {
  _id: string;
  title: string;
  description?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  steps: RoadmapStep[];
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsRecord {
  _id: string;
  date: string;
  tasksCompleted: number;
  goalsAchieved: number;
  habitConsistency: number;
  focusScore: number;
  productivityScore: number;
  aiInsights?: string;
}

export interface AppNotification {
  _id: string;
  title: string;
  body: string;
  type: 'reminder' | 'recommendation' | 'chat';
  read: boolean;
  scheduledAt: string;
  createdAt: string;
}

export interface CalendarEvent {
  _id: string;
  title: string;
  type: 'task' | 'habit' | 'goal' | 'meeting';
  start: string;
  end: string;
  referenceId?: string;
}
