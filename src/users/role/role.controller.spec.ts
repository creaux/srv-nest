import { Test, TestingModule } from '@nestjs/testing';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { AccessGuard } from '../access/access.guard';
import { AuthService } from '../../auth/auth/auth.service';
import { UserService } from '../user/user.service';
import { ROLES_BUILDER_TOKEN } from 'nest-access-control/lib';

describe('Role Controller', () => {
  let controller: RoleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [
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

    controller = module.get<RoleController>(RoleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
