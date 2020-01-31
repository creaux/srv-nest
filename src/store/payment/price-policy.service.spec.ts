import { Test, TestingModule } from '@nestjs/testing';
import { PricePolicyService } from './price-policy.service';
import { PaymentService } from './payment.service';

describe('PricePolicyService', () => {
  let service: PricePolicyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PricePolicyService,
        {
          provide: PaymentService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<PricePolicyService>(PricePolicyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
