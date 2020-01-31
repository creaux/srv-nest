import { Module } from '@nestjs/common';
import { StripeModule } from 'nestjs-stripe';
import { ConfigFacade } from '../../../config/config.facade';
import { StripePaymentService } from './stripe-payment.service';
import { StripeWebhookController } from './stripe-webhook.controller';
import { StripeWebhookService } from './stripe-webhook.service';
import { ConfigModule } from '../../../config/config.module';

@Module({
  imports: [
    StripeModule.forRootAsync({
      inject: [ConfigFacade],
      useFactory: async (config: ConfigFacade) => {
        return {
          apiKey: config.STRIPE_SECRET,
        };
      },
      imports: [ConfigModule],
    }),
    ConfigModule,
  ],
  providers: [StripePaymentService, StripeWebhookService],
  exports: [StripePaymentService],
  controllers: [StripeWebhookController],
})
export class StripePaymentModule {}
