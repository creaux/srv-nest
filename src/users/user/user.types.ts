import { Document, Types } from 'mongoose';
import { ApiModelProperty } from '@nestjs/swagger';
import {
  CreateUserModel,
  UserModel as IUserModel,
} from '@pyxismedia/lib-model';

export class UserCreateDto implements CreateUserModel {
  constructor(
    forname: string,
    surname: string,
    email: string,
    password: string,
  ) {
    this.forname = forname;
    this.surname = surname;
    this.email = email;
    this.password = password;
  }

  @ApiModelProperty()
  readonly forname: string;

  @ApiModelProperty()
  readonly surname: string;

  @ApiModelProperty()
  readonly email: string;

  @ApiModelProperty()
  readonly password: string;
}

export class UserModel implements IUserModel {
  @ApiModelProperty()
  _id: any;

  @ApiModelProperty()
  forname: string;

  @ApiModelProperty()
  surname: string;

  @ApiModelProperty()
  email: string;

  @ApiModelProperty()
  password: string;

  constructor(
    _id: any = Types.ObjectId(),
    forname: string,
    surname: string,
    email: string,
    password: string,
  ) {
    this._id = _id;
    this.forname = forname;
    this.surname = surname;
    this.email = email;
    this.password = password;
  }
}

export interface User extends Document, UserModel {}

export const USER_MODEL = 'User';
