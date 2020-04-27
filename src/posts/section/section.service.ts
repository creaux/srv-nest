import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SchemaName, SectionModel } from '@pyxismedia/lib-model';
import { Section } from '../post/post.types';

@Injectable()
export class SectionService {
  constructor(
    @InjectModel(SchemaName.SECTION)
    private readonly sectionModel: Model<Section>,
  ) {}

  async findById(id: string): Promise<SectionModel | null> {
    return await this.sectionModel
      .findById(id)
      .exec()
      .then(document => {
        if (document) {
          return new SectionModel(document.toObject());
        }
        return null;
      });
  }
}
