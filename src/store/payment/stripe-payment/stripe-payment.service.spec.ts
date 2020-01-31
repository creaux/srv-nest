import { Test, TestingModule } from '@nestjs/testing';
import { StripePaymentService } from './stripe-payment.service';

describe('StripeService', () => {
  let service: StripePaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StripePaymentService,
        {
          provide: 'StripeToken',
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<StripePaymentService>(StripePaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
