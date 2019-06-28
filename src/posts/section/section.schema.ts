import { Schema } from 'mongoose';

const { Types } = Schema;

export const SectionSchema = new Schema(
  {
    _id: { type: Types.ObjectId },
    name: { type: String, intl: true },
  },
  {
    toJSON: {
      // To work with mongoose-intl
      virtuals: true,
    },
  },
);
