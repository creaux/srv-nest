import { Test, TestingModule } from '@nestjs/testing';
import { StripeWebhookController } from './stripe-webhook.controller';
import { ConfigFacade } from '../../../config/config.facade';
import { StripeWebhookService } from './stripe-webhook.service';

describe('StripeWebhook Controller', () => {
  let controller: StripeWebhookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StripeWebhookController],
      providers: [
        {
          provide: 'StripeToken',
          useValue: {},
        },
        {
          provide: ConfigFacade,
          useValue: {},
        },
        {
          provide: StripeWebhookService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<StripeWebhookController>(StripeWebhookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
