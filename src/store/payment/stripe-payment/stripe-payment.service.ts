import { Injectable } from '@nestjs/common';
import { InjectStripe } from 'nestjs-stripe';
import { Stripe } from 'stripe';
import { PaymentModel } from '@pyxismedia/lib-model';

@Injectable()
export class StripePaymentService {
  constructor(@InjectStripe() private readonly stripe: Stripe) {}

  public async getClientSecret(
    paymentIntentCreateParams: Stripe.PaymentIntentCreateParams,
  ): Promise<PaymentModel> {
    const {
      client_secret,
      id,
      created,
    } = await this.stripe.paymentIntents.create(paymentIntentCreateParams);
    const createdAt = new Date(0).setSeconds(created).toString();
    return { secret: client_secret, paymentId: id, createdAt };
  }
}
