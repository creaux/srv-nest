import { Injectable, ConflictException } from '@nestjs/common';
import { ROLE_MODEL, RoleSchemaInterface } from '@pyxismedia/lib-model';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RoleResponseDto } from './role-response.dto';
import { CreateRoleRequestDto } from './dto/create-role-request.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(ROLE_MODEL)
    private readonly userModel: Model<RoleSchemaInterface>,
  ) {}

  public findAll(skip: number) {
    return this.userModel
      .find()
      .sort('name')
      .skip(skip)
      .exec()
      .then(documents =>
        documents.map(document => {
          return plainToClass(RoleResponseDto, document.toObject());
        }),
      );
  }
  public findById(id: string) {
    return this.userModel
      .findById(id)
      .exec()
      .then(document => {
        if (document) {
          return plainToClass(RoleResponseDto, document.toObject());
        }
        return null;
      });
  }

  public findByName(name: string) {
    return this.userModel.findOne({ name }).then(document => {
      if (document) {
        return plainToClass(RoleResponseDto, document.toObject());
      }
      return null;
    });
  }

  public async create(
    createRoleRequestDto: CreateRoleRequestDto,
  ): Promise<RoleResponseDto | ConflictException> {
    const existingRole = await this.findByName(createRoleRequestDto.name);

    if (existingRole != null) {
      throw new ConflictException('Role with the same name already exists.');
    }

    return this.userModel
      .create({ _id: Types.ObjectId(), ...createRoleRequestDto })
      .then(document => plainToClass(RoleResponseDto, document.toObject()));
  }
  public delete(id: string) {
    return this.userModel
      .findByIdAndRemove(id)
      .then(document => plainToClass(RoleResponseDto, document.toObject()));
  }
}
