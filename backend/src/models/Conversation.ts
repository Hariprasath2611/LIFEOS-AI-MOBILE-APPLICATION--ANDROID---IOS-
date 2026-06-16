import { Schema, model, Document } from 'mongoose';

export interface IConversation extends Document {
  userId: string;
  title: string;
  pinned: boolean;
  summary?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, default: 'New Conversation' },
    pinned: { type: Boolean, default: false },
    summary: { type: String },
  },
  { timestamps: true }
);

export const Conversation = model<IConversation>('Conversation', ConversationSchema);
