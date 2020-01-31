import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { StripePaymentModule } from './stripe-payment/stripe-payment.module';
import { PricePolicyService } from './price-policy.service';

@Module({
  imports: [StripePaymentModule],
  providers: [PaymentService, PricePolicyService],
  exports: [PaymentService],
})
export class PaymentModule {}
