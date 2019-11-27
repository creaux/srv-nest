import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { UsersModule } from '../users/users.module';
import { HttpStrategy } from './auth/http.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { AUTH_MODEL } from './auth/dto/auth-sign-in-request.dto';
import { AuthController } from './auth/auth.controller';
import { AuthSchema } from '@pyxismedia/lib-model';
import { LibraryModule } from '../library/library.module';
import { MongoModule } from '../mongo/mongo.module';

@Module({
  imports: [
    MongoModule,
    forwardRef(() => UsersModule),
    MongooseModule.forFeature([{ name: AUTH_MODEL, schema: AuthSchema }]),
    LibraryModule,
  ],
  providers: [AuthService, HttpStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
