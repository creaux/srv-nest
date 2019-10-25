import { ConflictException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { USER_MODEL, CreateUserRequestDto } from './create-user-request.dto';
import { UserSchemaInterface } from '@pyxismedia/lib-model';
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
      .exec()
      .then(documents =>
        documents.map(document => {
          return new UserResponseDto(document.toObject());
        }),
      );
  }

  async findById(id: string): Promise<UserResponseDto> {
    return await this.userModel.findById(id).then(document => {
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

    console.log(createUserRequestDto);

    return await this.userModel
      .create(createUserRequestDto)
      .then(document => new UserResponseDto(document.toObject()))
      .then(data => {
        console.log(data);
        return data;
      });
  }

  async findByEmail(email: string): Promise<UserResponseDto> {
    return await this.userModel.findOne({ email }).then(document => {
      if (document) {
        return new UserResponseDto(document.toObject());
      }
      return null;
    });
  }
}
