import { Document } from 'mongoose';
import {
  PostStateEnum as PostState,
  SectionModel,
} from '@pyxismedia/lib-model';

export { PostState };

export interface Section extends SectionModel, Document {}
