import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ACCESS_MODEL, AccessSchema } from '@pyxismedia/lib-model';
import { AccessService } from './access.service';
import { AccessGuard } from './access.guard';
import { AuthModule } from '../../auth/auth.module';
import { UsersModule } from '../users.module';
import { PipesModule } from '../../pipes/pipes.module';
import { AccessController } from './access.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ACCESS_MODEL, schema: AccessSchema }]),
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
    PipesModule,
  ],
  controllers: [AccessController],
  providers: [AccessService, AccessGuard],
  exports: [AccessService, AccessGuard],
})
export class AccessModule {}
