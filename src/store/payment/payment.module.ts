import { forwardRef, Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { StripePaymentModule } from './stripe-payment/stripe-payment.module';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [
    forwardRef(() => StripePaymentModule),
    forwardRef(() => OrderModule),
  ],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
