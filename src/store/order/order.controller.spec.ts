import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { ROLES_BUILDER_TOKEN } from 'nest-access-control/lib';
import { OrderService } from './order.service';
import { AuthService } from '../../auth/auth/auth.service';
import { UserService } from '../../users/user/user.service';
import { RoleService } from '../../users/role/role.service';

describe('Order Controller', () => {
  let controller: OrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: ROLES_BUILDER_TOKEN,
          useValue: {},
        },
        {
          provide: OrderService,
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
          provide: RoleService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
