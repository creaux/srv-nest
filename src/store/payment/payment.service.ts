import { Injectable } from '@nestjs/common';
import { StripePaymentService } from './stripe-payment/stripe-payment.service';

@Injectable()
export class PaymentService {
  constructor(public readonly stripePaymentService: StripePaymentService) {}

  public getPaymentSecret(
    amount: number,
    currency: string,
  ): Promise<{ client_secret: string; id: string }> {
    return this.stripePaymentService.getClientSecret({ amount, currency });
  }
}
