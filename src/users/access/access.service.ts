import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ACCESS_MODEL, AccessSchemaInterface } from '@pyxismedia/lib-model';
import { Model } from 'mongoose';
import { AccessResponseDto } from './dto/access-response.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class AccessService {
  constructor(
    @InjectModel(ACCESS_MODEL)
    private readonly accessModel: Model<AccessSchemaInterface>,
  ) {}

  public async findAll(skip: number = 0): Promise<AccessResponseDto[]> {
    return await this.accessModel
      .find()
      .sort('_id')
      .skip(skip)
      .exec()
      .then(documents =>
        documents.map(document =>
          plainToClass(AccessResponseDto, document.toObject()),
        ),
      );
  }
}
