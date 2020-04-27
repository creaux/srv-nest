import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { MongoModule } from '../mongo/mongo.module';
import { RoleService } from './role/role.service';
import { RoleController } from './role/role.controller';
import {
  UserSchema,
  SchemaName,
  RoleSchema,
  UserExistsConstrain,
  USER_RESOURCE_TOKEN,
} from '@pyxismedia/lib-model';
import { AccessService } from './access/access.service';
import { AccessControlModule, RolesBuilder } from 'nest-access-control/lib';
import { AccessModule } from './access/access.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongoModule,
    MongooseModule.forFeature([
      { name: SchemaName.USER, schema: UserSchema },
      { name: SchemaName.ROLE, schema: RoleSchema },
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
    forwardRef(() => AuthModule),
  ],
  providers: [
    // TODO: Unify USER_RESOURCE_TOKEN and UserService
    {
      provide: USER_RESOURCE_TOKEN,
      useClass: UserService,
    },
    UserService,
    RoleService,
    UserExistsConstrain,
  ],
  controllers: [UserController, RoleController],
  exports: [UserService, RoleService, UserExistsConstrain],
})
export class UsersModule {}
