import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthSuccessModel } from '@pyxismedia/lib-model/build/auth/auth-success.model';
import { AuthSignInModel } from '@pyxismedia/lib-model/build/auth/auth-signin.model';

describe('Auth Controller', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signIn() {},
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be possible to signIn', async () => {
    const spy = jest
      .spyOn(authService, 'signIn')
      .mockImplementation(() => Promise.resolve(AuthSuccessModel.MOCK));
    const calledWith = {
      email: AuthSignInModel.MOCK.email,
      password: AuthSignInModel.MOCK.password,
    };
    const result = await controller.signIn(calledWith);
    expect(spy).toHaveBeenCalledWith(calledWith);
    expect(result).toEqual(AuthSuccessModel.MOCK);
  });
});
