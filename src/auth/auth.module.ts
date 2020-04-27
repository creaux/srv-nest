import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { UsersModule } from '../users/users.module';
import { HttpStrategy } from './auth/http.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth/auth.controller';
import { AuthSchema, SchemaName } from '@pyxismedia/lib-model';
import { LibraryModule } from '../library/library.module';
import { MongoModule } from '../mongo/mongo.module';
import { UserByBearerPipe } from './pipes/user-by-bearer.pipe';

@Module({
  imports: [
    MongoModule,
    forwardRef(() => UsersModule),
    MongooseModule.forFeature([{ name: SchemaName.AUTH, schema: AuthSchema }]),
    LibraryModule,
  ],
  providers: [AuthService, HttpStrategy, UserByBearerPipe],
  controllers: [AuthController],
  exports: [AuthService, UserByBearerPipe],
})
export class AuthModule {}
