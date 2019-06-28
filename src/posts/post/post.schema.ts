import { Schema } from 'mongoose';

const { Types } = Schema;

export const PostSchema = new Schema(
  {
    _id: { type: Types.ObjectId },
    title: { type: String, intl: true },
    subtitle: { type: String, intl: true },
    content: { type: String, intl: true },
    state: { type: String, intl: true },
    slug: { type: String, intl: true },
    labels: { type: [String] }, // FIXME: Cannot use for Array
    createdAt: { type: Date },
    updatedAt: { type: Date },
    image: { type: String },
    createdBy: { type: Types.ObjectId },
    updatedBy: { type: Types.ObjectId },
    section: { type: Types.ObjectId, ref: 'Section' },
  },
  {
    toJSON: {
      // To work with mongoose-intl
      virtuals: true,
    },
  },
);
