import { Injectable } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Injectable()
export class PricePolicyService {
  constructor(private readonly paymentService: PaymentService) {}
}
