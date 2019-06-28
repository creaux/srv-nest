import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Section } from '../post/post.types';

@Injectable()
export class SectionService {
  constructor(
    @InjectModel('Section') private readonly sectionModel: Model<Section>,
  ) {}

  async findById(id: Types.ObjectId): Promise<Section> {
    return await this.sectionModel.findById(id);
  }
}
