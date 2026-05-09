import mongoose, { Document, Schema } from 'mongoose';

export type UserRole = 'admin' | 'user';

export interface IUser extends Document {
  googleId: string;
  email: string;
  name: string;
  avatar: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    googleId: { type: String, required: true, unique: true },
    email:    { type: String, required: true, unique: true, lowercase: true },
    name:     { type: String, required: true },
    avatar:   { type: String, default: '' },
    role:     { type: String, enum: ['admin', 'user'], default: 'user' },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
