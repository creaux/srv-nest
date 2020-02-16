import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AccessGuard } from '../access/access.guard';
import { AuthService } from '../../auth/auth/auth.service';
import { ROLES_BUILDER_TOKEN } from 'nest-access-control/lib';
import { RoleService } from '../role/role.service';

describe('User Controller', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {},
        },
        {
          provide: RoleService,
          useValue: {},
        },
        {
          provide: AccessGuard,
          useValue: {},
        },
        {
          provide: AuthService,
          useValue: {},
        },
        {
          provide: UserService,
          useValue: {},
        },
        {
          provide: ROLES_BUILDER_TOKEN,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
