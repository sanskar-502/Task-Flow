import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  owner: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['todo', 'in_progress', 'done'], default: 'todo', index: true },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

taskSchema.index({ title: 'text', description: 'text', tags: 'text' });

export const Task = mongoose.model<ITask>('Task', taskSchema);
