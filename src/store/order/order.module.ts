import { forwardRef, Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { MongoModule } from '../../mongo/mongo.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ORDER_MODEL, OrderSchema, SchemaName } from '@pyxismedia/lib-model';
import { PipesModule } from '../../pipes/pipes.module';
import { UsersModule } from '../../users/users.module';
import { AuthModule } from '../../auth/auth.module';
import { ProductModule } from '../product/product.module';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [
    MongoModule,
    MongooseModule.forFeature([
      {
        name: SchemaName.ORDER,
        schema: OrderSchema,
      },
    ]),
    PipesModule,
    UsersModule,
    AuthModule,
    ProductModule,
    forwardRef(() => PaymentModule),
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
