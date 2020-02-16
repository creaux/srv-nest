import { Test, TestingModule } from '@nestjs/testing';
import { AccessController } from './access.controller';
import { AccessService } from './access.service';
import { RoleService } from '../role/role.service';
import { AccessGuard } from './access.guard';
import { AuthService } from '../../auth/auth/auth.service';
import { UserService } from '../user/user.service';
import { ROLES_BUILDER_TOKEN } from 'nest-access-control/lib';

describe('Access Controller', () => {
  let controller: AccessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccessController],
      providers: [
        {
          provide: AccessService,
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

    controller = module.get<AccessController>(AccessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
