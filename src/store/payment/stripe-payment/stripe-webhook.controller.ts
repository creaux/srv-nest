import {
  Controller,
  Post,
  Headers,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { Stripe } from 'stripe';
import { InjectStripe } from 'nestjs-stripe';
import { ConfigFacade } from '../../../config/config.facade';
import { StripeWebhookService } from './stripe-webhook.service';

@Controller('store/stripe/webhook')
export class StripeWebhookController {
  constructor(
    @InjectStripe() private readonly stripe: Stripe,
    private readonly config: ConfigFacade,
    private readonly stripeWebhookService: StripeWebhookService,
  ) {}

  @Post()
  public webhook(
    @Headers('stripe-signature') sig: string,
    @Body() body: string | Buffer,
  ): { received: true } | BadRequestException {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        body,
        sig,
        this.config.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      throw new BadRequestException(`Stripe webhook Error: ${err.message}`);
    }

    return this.stripeWebhookService.processEvent(event);
  }
}
