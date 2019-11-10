import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ACCESS_MODEL, AccessSchema } from '@pyxismedia/lib-model';
import { AccessService } from './access.service';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ACCESS_MODEL, schema: AccessSchema }]),
  ],
  providers: [AccessService],
  exports: [AccessService],
})
export class AccessModule {}
