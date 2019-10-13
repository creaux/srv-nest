import { Types, Document } from 'mongoose';
import {
  PostStateEnum as PostState,
  PostModel,
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
  readonly createdBy: string;
  readonly section: string;
  readonly id: string;
  readonly updatedBy: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}
