import { Module } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { UsersModule } from '../users/users.module';
import { HttpStrategy } from './auth/http.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { AUTH_MODEL } from './auth/auth-sign-in-request.dto';
import { AuthController } from './auth/auth.controller';
import { AuthSchema } from '@pyxismedia/lib-model';
import { LibraryModule } from '../library/library.module';
import { MongoModule } from '../mongo/mongo.module';

@Module({
  imports: [
    MongoModule,
    UsersModule,
    MongooseModule.forFeature([{ name: AUTH_MODEL, schema: AuthSchema }]),
    LibraryModule,
  ],
  providers: [AuthService, HttpStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
