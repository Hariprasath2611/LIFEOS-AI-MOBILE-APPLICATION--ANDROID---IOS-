import { Schema, model, Document } from 'mongoose';

export interface INotification extends Document {
  userId: string;
  title: string;
  body: string;
  type: 'reminder' | 'recommendation' | 'chat';
  read: boolean;
  scheduledAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    type: { type: String, enum: ['reminder', 'recommendation', 'chat'], default: 'reminder' },
    read: { type: Boolean, default: false },
    scheduledAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Notification = model<INotification>('Notification', NotificationSchema);
