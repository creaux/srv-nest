import {
  CreateOrderModel,
  CreateOrderUserModel,
  OrderModel,
  UpdateOrderModel,
} from '@pyxismedia/lib-model';

export class CreateOrderRequestDto extends CreateOrderModel {}
export class CreateOrderUserDto extends CreateOrderUserModel {}
export class OrderResponseDto extends OrderModel {}
export class UpdateOrderRequestDto extends UpdateOrderModel {}
