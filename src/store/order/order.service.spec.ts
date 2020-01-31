import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { getModelToken } from '@nestjs/mongoose';
import { ORDER_MODEL } from '@pyxismedia/lib-model';
import { UserService } from '../../users/user/user.service';
import { ProductService } from '../product/product.service';
import { PaymentService } from '../payment/payment.service';

describe('OrderService', () => {
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getModelToken(ORDER_MODEL),
          useValue: {},
        },
        {
          provide: UserService,
          useValue: {},
        },
        {
          provide: ProductService,
          useValue: {},
        },
        {
          provide: PaymentService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
