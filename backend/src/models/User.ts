import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
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
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    uid: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true },
    displayName: { type: String },
    photoURL: { type: String },
    interests: { type: [String], default: [] },
    goals: { type: [String], default: [] },
    learningTopics: { type: [String], default: [] },
    productivityScore: { type: Number, default: 0 },
    preferences: {
      notificationsEnabled: { type: Boolean, default: true },
      aiAssistantEnabled: { type: Boolean, default: true },
      theme: { type: String, enum: ['dark', 'light'], default: 'dark' },
    },
  },
  { timestamps: true }
);

export const User = model<IUser>('User', UserSchema);
