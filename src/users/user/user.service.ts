import { ConflictException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserModel, USER_MODEL, UserCreate, User } from './user.types';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(USER_MODEL) private readonly userModel: Model<User>,
  ) {}

  async findAll(skip: number) {
    return await this.userModel
      .find()
      .skip(skip)
      .select('-password')
      .exec();
  }

  async findById(id: string) {
    return await this.userModel.findById(id).select('-password');
  }

  async createUser({ forname, surname, email, password }: UserCreate) {
    const existing = await this.findByEmail(email);

    if (existing != null) {
      return new ConflictException('User with the same email already exists.');
    }

    const user = new UserModel(undefined, forname, surname, email, password);
    return await this.userModel.create(user);
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }
}
