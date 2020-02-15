import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Stripe } from 'stripe';
import { StripeEventTypes } from './stripe-event-type.enum';
import { PaymentService } from '../payment.service';
import { RuntimeException } from '@nestjs/core/errors/exceptions/runtime.exception';
import { StripeAcknowledgeReceiptDto } from './dto';

@Injectable()
export class StripeWebhookService {
  constructor(private readonly paymentService: PaymentService) {}

  public async processEvent(
    event: Stripe.Event,
  ): Promise<
    StripeAcknowledgeReceiptDto | BadRequestException | NotFoundException
  > {
    switch (event.type) {
      case StripeEventTypes.CREATED:
        return new StripeAcknowledgeReceiptDto();
      case StripeEventTypes.SUCCEED:
        const isPaid = await this.paymentService.onPaymentSucceed(
          (event.data.object as any).metadata.order_id,
        );

        if (isPaid) {
          return new StripeAcknowledgeReceiptDto();
        }

        throw new RuntimeException(
          "Order hasn't been marked as paid for unknown reason",
        );
      default:
        throw new BadRequestException('Unexpected event type');
    }
  }
}
