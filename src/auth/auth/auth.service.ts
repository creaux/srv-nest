import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AUTH_MODEL, AuthSignInRequestDto } from './auth-sign-in-request.dto';
import { UserService } from '../../users/user/user.service';
import { AuthSchemaInterface } from '@pyxismedia/lib-model';
import {
  JwtToken,
  Jwt,
  Bcrypt,
  BcryptToken,
} from '../../library/library.module';
import { UserResponseDto } from '../../users/user/create-user-response.dto';
import { AuthSignInResponseDto } from './auth-sign-in-response.dto';
import { CreateAuthModel } from '@pyxismedia/lib-model/build/auth/create-auth.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(AUTH_MODEL)
    private readonly authModel: Model<AuthSchemaInterface>,
    private readonly userService: UserService,
    @Inject(JwtToken) private readonly jwt: Jwt,
    @Inject(BcryptToken) private readonly bcrypt: Bcrypt,
  ) {}

  async validateUser(token: string): Promise<AuthSignInResponseDto> {
    return await this.authModel
      .findOne({ token })
      .then(document => new AuthSignInResponseDto(document));
  }

  async createAuth(auth: CreateAuthModel): Promise<AuthSignInResponseDto> {
    return await this.authModel
      .create(auth)
      .then(document => new AuthSignInResponseDto(document.toObject()));
  }

  async findAuthByUserId(id: string): Promise<AuthSignInResponseDto> {
    return await this.authModel.findById(id).then(document => {
      return new AuthSignInResponseDto(document.toObject());
    });
  }

  private findUserByEmail(email: string): Promise<UserResponseDto> {
    return this.userService.findByEmail(email);
  }

  private comparePassword(
    existingPassword: string,
    password: string,
  ): Promise<boolean> {
    return this.bcrypt.compare(password, existingPassword);
  }

  async signIn({
    email,
    password,
  }: AuthSignInRequestDto): Promise<
    AuthSignInResponseDto | ForbiddenException
  > {
    const user = await this.findUserByEmail(email);

    if (user == null) {
      throw new NotFoundException("User doesn't exist.");
    }

    const comparison = await this.comparePassword(user.password, password);
    const token = this.jwt.sign(
      // iat makes sure that token is also unique eachtime when testing is very fast
      { user: user.email, iat: Math.floor(Date.now()) },
      '723bhjdw7',
    );

    if (comparison) {
      return await this.createAuth(
        new CreateAuthModel({ token, userId: user.id }),
      );
    }

    return await Promise.resolve(new ForbiddenException());
  }
}
