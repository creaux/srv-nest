import { Document, Types } from 'mongoose';

export enum PostState {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export interface PostMongo extends Document {
  title: string;
  subtitle: string;
  content: string;
  image: string;
  state: PostState;
  labels: string[];
  createdBy: Types.ObjectId;
  section: Types.ObjectId;
  //
  id: Types.ObjectId;
  updatedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface Section extends Document {
  name: string;
}

export class CreatePostDto {
  readonly title: string;
  readonly subtitle: string;
  readonly content: string;
  readonly image: string;
  readonly state: PostState;
  readonly labels: string[];
  readonly createdBy: Types.ObjectId;
  readonly section: Types.ObjectId;
}
