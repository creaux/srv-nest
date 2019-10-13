import { Document, Types } from 'mongoose';
import { ApiModelProperty } from '@nestjs/swagger';

export const AUTH_MODEL = 'Auth';

export class Auth {
  constructor(
    public _id: any = Types.ObjectId(),
    public token: string,
    public userId: string,
  ) {}
}

export interface AuthDB extends Document, Auth {}

export class AuthSignInDto {
  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

  @ApiModelProperty()
  readonly email: string;

  @ApiModelProperty()
  readonly password: string;
}
