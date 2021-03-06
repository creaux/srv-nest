import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { StripePaymentService } from './stripe-payment/stripe-payment.service';
import { OrderService } from '../order/order.service';

describe('PaymentService', () => {
  let service: PaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: StripePaymentService,
          useValue: {},
        },
        {
          provide: OrderService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
