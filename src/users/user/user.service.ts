import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { SchemaName, UserSchemaInterface } from '@pyxismedia/lib-model';
import { UserResponseDto } from './dto/create-user-response.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(SchemaName.USER)
    private readonly userModel: Model<UserSchemaInterface>,
  ) {}

  async findAll(skip: number): Promise<UserResponseDto[]> {
    return await this.userModel
      .find()
      .sort('surname')
      .skip(skip)
      .populate('roles')
      .exec()
      .then(documents =>
        documents.map(document => {
          return plainToClass(UserResponseDto, document.toObject());
        }),
      );
  }

  async findById(id: string): Promise<UserResponseDto> {
    return await this.userModel
      .findById(id)
      .populate('roles')
      .exec()
      .then(document => {
        if (document) {
          return plainToClass(UserResponseDto, document.toObject());
        }
        // TODO: Test exception
        throw new NotFoundException(
          `User with provided id ${id} doesn't exists`,
        );
      });
  }

  async createUser(createUserRequestDto: CreateUserRequestDto) {
    const existing = await this.findByEmail(createUserRequestDto.email);

    if (existing != null) {
      return new ConflictException('User with the same email already exists.');
    }

    return await this.userModel
      .create(createUserRequestDto)
      .then(document => plainToClass(UserResponseDto, document.toObject()));
  }

  async findByEmail(email: string): Promise<UserResponseDto> {
    return await this.userModel
      .findOne({ email: { $eq: email } })
      .populate('roles')
      .exec()
      .then(document => {
        if (document) {
          return plainToClass(UserResponseDto, document.toObject());
        }
        // TODO: Test exception
        throw new NotFoundException(
          `User with email ${email} hasn't been found`,
        );
      })
      .catch(err => {
        throw new Error(err);
      });
  }
}
