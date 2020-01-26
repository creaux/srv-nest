import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { MongoModule } from '../mongo/mongo.module';
import { RoleService } from './role/role.service';
import { RoleController } from './role/role.controller';
import { AccessController } from './access/access.controller';
import {
  UserSchema,
  ROLE_MODEL,
  RoleSchema,
  USER_MODEL,
} from '@pyxismedia/lib-model';
import { AccessService } from './access/access.service';
import { AccessControlModule, RolesBuilder } from 'nest-access-control/lib';
import { AccessModule } from './access/access.module';
import { UserExistsConstrain } from './constraints/user-exists.constrain';
import { AccessGuard } from './access/access.guard';

@Module({
  imports: [
    MongoModule,
    MongooseModule.forFeature([
      { name: USER_MODEL, schema: UserSchema },
      { name: ROLE_MODEL, schema: RoleSchema },
    ]),
    AccessControlModule.forRootAsync({
      imports: [AccessModule],
      inject: [AccessService],
      async useFactory(accessService: AccessService) {
        const rights = await accessService.findAll();
        return new RolesBuilder([...rights]);
      },
    }),
    AccessModule,
  ],
  providers: [UserService, RoleService, UserExistsConstrain],
  controllers: [UserController, RoleController, AccessController],
  exports: [UserService, RoleService, UserExistsConstrain],
})
export class UsersModule {}
