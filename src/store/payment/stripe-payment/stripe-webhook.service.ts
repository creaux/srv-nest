import { BadRequestException, Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';
import { StripeEventTypes } from './stripe-event-type.enum';

@Injectable()
export class StripeWebhookService {
  public processEvent(
    event: Stripe.Event,
  ): { received: true } | BadRequestException {
    switch (event.type) {
      case StripeEventTypes.SUCCEED:
        /* tslint:disable */
        console.log('Succeed!');
        // TODO Update Order as payed | how do I know id of order?!?
        /* tslint:enable */
        break;
      default:
        throw new BadRequestException('Unexpected event type');
    }

    return {
      received: true,
    };
  }
}
