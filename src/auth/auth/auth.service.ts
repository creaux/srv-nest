import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthSignInRequestDto } from './dto/auth-sign-in-request.dto';
import { UserService } from '../../users/user/user.service';
import {
  AuthSchemaInterface,
  CreateAuthModel,
  QueryPopulateOptionsBuilder,
  SchemaName,
} from '@pyxismedia/lib-model';
import { Bcrypt, BCRYPT, JWT, Jwt } from '../../library/library.module';
import { UserResponseDto } from '../../users/user/dto/create-user-response.dto';
import { AuthSignInResponseDto } from './dto/auth-sign-in-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(SchemaName.AUTH)
    private readonly authModel: Model<AuthSchemaInterface>,
    private readonly userService: UserService,
    @Inject(JWT) private readonly jwt: Jwt,
    @Inject(BCRYPT) private readonly bcrypt: Bcrypt,
  ) {}

  public async validateUser(token: string): Promise<AuthSignInResponseDto> {
    return await this.authModel
      .findOne({ token })
      .populate(
        new QueryPopulateOptionsBuilder()
          .withPath('user')
          .withModel(SchemaName.USER)
          .withPopulate(
            new QueryPopulateOptionsBuilder()
              .withPath('roles')
              .withModel(SchemaName.ROLE)
              .build(),
          )
          .build(),
      )
      .exec()
      .then(document => {
        if (document) {
          return new AuthSignInResponseDto(document.toObject());
        }
        return null;
      });
  }

  public async createAuth(
    auth: CreateAuthModel,
  ): Promise<AuthSignInResponseDto | null> {
    return await this.authModel.create(auth).then(document => {
      if (document) {
        return new AuthSignInResponseDto(document.toObject());
      }
      return null;
    });
  }

  public async findAuthByUserId(id: string): Promise<AuthSignInResponseDto> {
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

  public async signIn({
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
        new CreateAuthModel({ token, user: user._id }),
      );
    }

    return await Promise.resolve(new ForbiddenException());
  }
}
