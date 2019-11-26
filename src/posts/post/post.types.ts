import { Document } from 'mongoose';
import { PostStateEnum as PostState } from '@pyxismedia/lib-model';

export { PostState };

export interface Section extends Document {
  id: string;
  name: string;
}
