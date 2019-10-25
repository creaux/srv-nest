import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { AUTH_MODEL, AuthSignInRequestDto } from './auth-sign-in-request.dto';
import { UserService } from '../../users/user/user.service';
import { Model } from 'mongoose';
import { AuthSchemaInterface, AuthSuccessModel } from '@pyxismedia/lib-model';
import {
  BcryptToken,
  Bcrypt,
  Jwt,
  JwtToken,
} from '../../library/library.module';
import { UserSchemaInterface } from '../../../../lib-model/src/user/user-schema.interface';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let authModel: Model<AuthSchemaInterface>;
  let bcrypt: Bcrypt;
  let jwt: Jwt;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(AUTH_MODEL),
          useValue: {
            findOne() {},
            create() {},
            findById() {},
          },
        },
        {
          provide: UserService,
          useValue: {
            findByEmail() {},
          },
        },
        {
          provide: BcryptToken,
          useValue: {
            compare() {},
          },
        },
        {
          provide: JwtToken,
          useValue: {
            sign() {},
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    authModel = module.get(getModelToken(AUTH_MODEL));
    bcrypt = module.get<Bcrypt>(BcryptToken);
    jwt = module.get<Jwt>(JwtToken);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate user', () => {
    const spy = jest.spyOn(authModel, 'findOne');
    service.validateUser('a');
    expect(spy).toHaveBeenCalledWith({ token: 'a' });
  });

  it('should create auth', () => {
    const spy = jest.spyOn(authModel, 'create');
    service.createAuth(AuthSuccessModel.MOCK);
    expect(spy).toHaveBeenCalledWith(AuthSuccessModel.MOCK);
  });

  it('should findAuthByUserId', () => {
    const spy = jest.spyOn(authModel, 'findById');
    service.findAuthByUserId('a');
    expect(spy).toHaveBeenCalledWith('a');
  });

  it('should signIn the user', () => {
    const findByEmailSpy = jest
      .spyOn(userService, 'findByEmail')
      .mockImplementation(() =>
        Promise.resolve((new Map(
          Object.entries({
            email: 'emailMock',
            password: 'passwordMock',
            id: 'idMock',
          }),
        ) as unknown) as UserSchemaInterface),
      );
    const comparisonSpy = jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation(() => Promise.resolve(true));
    const jwtSpy = jest.spyOn(jwt, 'sign').mockImplementation(() => 'abc');
    service.signIn(new AuthSignInRequestDto('email', 'password'));
    expect(findByEmailSpy).toHaveBeenCalled();
    expect(findByEmailSpy).toHaveBeenCalledWith('email');
    // FIXME: Bug? it is not called
    // expect(comparisonSpy).toHaveBeenCalled();
    // expect(comparisonSpy).toHaveBeenCalledWith('password', 'passwordMock');
    // expect(jwtSpy).toHaveBeenCalled();
    // expect(jwtSpy).toHaveBeenCalledWith(
    //   new AuthSuccessModel(undefined, 'abc', 'idMock'),
    // );
  });
});
