import { Module } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { UsersModule } from '../users/users.module';
import { HttpStrategy } from './auth/http.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { AUTH_MODEL } from './auth/auth.types';
import { AuthController } from './auth/auth.controller';
import { AuthSchema } from '@pyxismedia/lib-model';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: AUTH_MODEL, schema: AuthSchema }]),
  ],
  providers: [AuthService, HttpStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
