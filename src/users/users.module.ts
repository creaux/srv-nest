import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user/user.service';
import { UserSchema } from '@pyxismedia/lib-model';
import { UserController } from './user/user.controller';
import { USER_MODEL } from './user/create-user-request.dto';
import { MongoModule } from '../mongo/mongo.module';

@Module({
  imports: [
    MongoModule,
    MongooseModule.forFeature([{ name: USER_MODEL, schema: UserSchema }]),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UsersModule {}
