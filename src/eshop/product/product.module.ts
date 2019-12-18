import { Module } from '@nestjs/common';
import { ProductController } from './product/product.controller';
import { ProductService } from './product/product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PRODUCT_MODEL, ProductSchema } from '@pyxismedia/lib-model';
import { PipesModule } from '../../pipes/pipes.module';
import { MongoModule } from '../../mongo/mongo.module';
import { UsersModule } from '../../users/users.module';
import { AuthModule } from '../../auth/auth.module';
import { LoggerModule } from '../../logger/logger.module';

@Module({
  imports: [
    MongoModule,
    MongooseModule.forFeature([
      {
        name: PRODUCT_MODEL,
        schema: ProductSchema,
      },
    ]),
    PipesModule,
    UsersModule,
    AuthModule,
    LoggerModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
