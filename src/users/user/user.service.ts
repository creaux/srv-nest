import { ConflictException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserRequestDto } from './create-user-request.dto';
import {
  UserSchemaInterface,
  USER_MODEL,
  ROLE_MODEL,
} from '@pyxismedia/lib-model';
import { UserResponseDto } from './create-user-response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(USER_MODEL)
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
          return new UserResponseDto(document.toObject());
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
          return new UserResponseDto(document.toObject());
        }
        return null;
      });
  }

  async createUser(createUserRequestDto: CreateUserRequestDto) {
    const existing = await this.findByEmail(createUserRequestDto.email);

    if (existing != null) {
      return new ConflictException('User with the same email already exists.');
    }

    return await this.userModel
      .create(createUserRequestDto)
      .then(document => new UserResponseDto(document.toObject()))
      .then(data => {
        return data;
      });
  }

  async findByEmail(email: string): Promise<UserResponseDto> {
    return await this.userModel
      .findOne({ email })
      .populate('roles')
      .exec()
      .then(document => {
        if (document) {
          return new UserResponseDto(document.toObject());
        }
        return null;
      });
  }
}
