import { Injectable } from '@nestjs/common';
import { InjectStripe } from 'nestjs-stripe';
import { Stripe } from 'stripe';

@Injectable()
export class StripePaymentService {
  constructor(@InjectStripe() private readonly stripe: Stripe) {}

  public async getClientSecret(
    paymentIntentCreateParams: Stripe.PaymentIntentCreateParams,
  ): Promise<{ client_secret: string; id: string }> {
    const { client_secret, id } = await this.stripe.paymentIntents.create(
      paymentIntentCreateParams,
    );
    return { client_secret, id };
  }
}
