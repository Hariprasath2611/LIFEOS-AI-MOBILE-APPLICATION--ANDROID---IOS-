import { Schema, model, Document } from 'mongoose';

export interface IMemory extends Document {
  userId: string;
  conversationId: string;
  sender: 'user' | 'ai';
  content: string;
  embedding: number[]; // Optional vector values for semantic search
  metadata: Record<string, any>;
  createdAt: Date;
}

const MemorySchema = new Schema<IMemory>(
  {
    userId: { type: String, required: true, index: true },
    conversationId: { type: String, required: true, index: true },
    sender: { type: String, enum: ['user', 'ai'], required: true },
    content: { type: String, required: true },
    embedding: { type: [Number], default: [] },
    metadata: { type: Map, of: Schema.Types.Mixed, default: {} },
    createdAt: { type: Date, default: Date.now },
  }
);

export const Memory = model<IMemory>('Memory', MemorySchema);
