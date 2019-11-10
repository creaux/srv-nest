import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ACCESS_MODEL, AccessSchemaInterface } from '@pyxismedia/lib-model';
import { Model } from 'mongoose';
import { AccessResponseDto } from './access-response.dto';

@Injectable()
export class AccessService {
  constructor(
    @InjectModel(ACCESS_MODEL)
    private readonly accessModel: Model<AccessSchemaInterface>,
  ) {}

  public async findAll(): Promise<AccessResponseDto[]> {
    return await this.accessModel
      .find()
      .exec()
      .then(documents => {
        return documents.map(
          document => new AccessResponseDto(document.toObject()),
        );
      });
  }
}
