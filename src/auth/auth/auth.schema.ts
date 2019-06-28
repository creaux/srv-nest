import { Schema, Types } from 'mongoose';

export const AuthSchema = new Schema({
  _id: Types.ObjectId,
  userId: { type: Types.ObjectId },
  token: {
    type: String,
    unique: true,
  },
  createdAt: { type: Date, expires: 3600, default: Date.now },
});
