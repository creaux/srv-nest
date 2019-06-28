import {
  ExceptionFilter,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auth, AUTH_MODEL, AuthDB, AuthSignIn } from './auth.types';
import { UserService } from '../../users/user/user.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(AUTH_MODEL) private readonly authModel: Model<AuthDB>,
    private readonly userService: UserService,
  ) {}

  async validateUser(token: string) {
    return await this.authModel.findOne({ token });
  }

  async createAuth(auth: Auth) {
    return await this.authModel.create(auth);
  }

  async findAuthByUserId(id: string) {
    return await this.authModel.findById(id);
  }

  async signIn({ email, password }: AuthSignIn) {
    const user = await this.userService.findByEmail(email);

    if (user == null) {
      throw new NotFoundException("User doesn't exist.");
    }

    const comparison = await bcrypt.compare(password, user.get('password'));
    const token = jwt.sign({ user: user.get('email') }, '723bhjdw7');

    if (comparison) {
      return await this.createAuth(new Auth(undefined, token, user.get('id')));
    }

    return await Promise.resolve(new ForbiddenException());
  }
}
