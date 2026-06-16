import { Schema, model, Document } from 'mongoose';

export interface INoteAttachment {
  type: 'image' | 'audio' | 'document';
  url: string;
}

export interface INote extends Document {
  userId: string;
  title: string;
  content: string; // Markdown supported
  tags: string[];
  folder: string;
  attachments: INoteAttachment[];
  isFavorite: boolean;
  aiSummary?: string;
  aiTags: string[];
  aiInsights?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NoteAttachmentSchema = new Schema<INoteAttachment>({
  type: { type: String, enum: ['image', 'audio', 'document'], required: true },
  url: { type: String, required: true },
});

const NoteSchema = new Schema<INote>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, default: 'Untitled Note' },
    content: { type: String, default: '' },
    tags: { type: [String], default: [] },
    folder: { type: String, default: 'Uncategorized' },
    attachments: { type: [NoteAttachmentSchema], default: [] },
    isFavorite: { type: Boolean, default: false },
    aiSummary: { type: String },
    aiTags: { type: [String], default: [] },
    aiInsights: { type: String },
  },
  { timestamps: true }
);

export const Note = model<INote>('Note', NoteSchema);
