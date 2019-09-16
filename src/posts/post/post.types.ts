import { Types, Document } from 'mongoose';
import {
  PostStateEnum as PostState,
  PostModel,
  CreatePostModel,
  SectionModel,
} from '@pyxismedia/lib-model';

export { PostState };

export interface Section extends SectionModel, Document {}

export interface PostMongo extends PostModel, Document {
  readonly title: string;
  readonly subtitle: string;
  readonly content: string;
  readonly image: string;
  readonly state: PostState;
  readonly labels: string[];
  readonly createdBy: Types.ObjectId;
  readonly section: Types.ObjectId;
  readonly id: Types.ObjectId;
  readonly updatedBy: Types.ObjectId;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export class CreatePostDto implements CreatePostModel {
  readonly title: string;
  readonly subtitle: string;
  readonly content: string;
  readonly image: string;
  readonly state: PostState;
  readonly labels: string[];
  readonly createdBy: Types.ObjectId;
  readonly section: Types.ObjectId;
}
