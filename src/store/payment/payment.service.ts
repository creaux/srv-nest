import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StripePaymentService } from './stripe-payment/stripe-payment.service';
import { OrderService } from '../order/order.service';
import { PaymentModel, OrderProcess } from '@pyxismedia/lib-model';

@Injectable()
export class PaymentService {
  constructor(
    public readonly stripePaymentService: StripePaymentService,
    @Inject(forwardRef(() => OrderService))
    public readonly orderService: OrderService,
  ) {}

  public getPaymentSecret(
    amount: number,
    currency: string,
  ): Promise<PaymentModel> {
    return this.stripePaymentService.getClientSecret({ amount, currency });
  }

  public async onPaymentSucceed(
    orderId: string,
  ): Promise<NotFoundException | boolean> {
    const order = await this.orderService.findOrderByIdAndMarkAsPaid(orderId);
    // FIXME It should be possible to use instanceof, but it doesn't work with plainToClass -> class-transformer
    return order.id === orderId && order.process === OrderProcess.PAID;
  }
}
