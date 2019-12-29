import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotImplementedException,
  Request,
} from '@nestjs/common';
import { AuthService } from '../auth/auth/auth.service';
import { UserService } from './user/user.service';
import { Reflector } from '@nestjs/core';
import {
  InjectRolesBuilder,
  Role,
  RolesBuilder,
} from 'nest-access-control/lib';
import { IQueryInfo } from 'accesscontrol';
import { RoleResponseDto } from './role/role-response.dto';
import { RoleService } from './role/role.service';
import { LoggerService } from '../logger/logger.service';
import { Types } from 'mongoose';
import { UserResponseDto } from './user/dto/create-user-response.dto';

@Injectable()
export class AccessGuard implements CanActivate {
  private static getBearerFromAuthorization(
    authorization: string | undefined,
  ): string | null {
    if (typeof authorization === 'string') {
      return authorization.split(' ')[1];
    }
    return null;
  }

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly reflector: Reflector,
    @InjectRolesBuilder() private readonly roleBuilder: RolesBuilder,
    private readonly roleService: RoleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let userRoles: RoleResponseDto[];
    const request: Request = context.switchToHttp().getRequest();
    const { authorization } = request.headers as any;
    const token = AccessGuard.getBearerFromAuthorization(authorization);
    const user = await this.getUserByToken(token);
    if (user && user.roles instanceof Array) {
      userRoles = user.roles;
    }
    const anonymous = await this.getAnonymous();
    const roles = this.reflector.get<Role[]>('roles', context.getHandler());

    return roles.some(role => {
      const queryInfo: IQueryInfo = role;
      if (userRoles == undefined || userRoles.length === 0) {
        userRoles = anonymous;
      }

      queryInfo.role = userRoles.map(
        (userRole: RoleResponseDto) => userRole.name,
      );

      const permission = this.roleBuilder.permission(queryInfo);
      return permission.granted;
    });
  }

  private async getUserByToken(
    token: string | null,
  ): Promise<UserResponseDto | null> {
    if (typeof token === 'string') {
      const auth = await this.authService.validateUser(token);
      if (auth && auth.user) {
        return auth.user;
      }
    }
    return null;
  }

  private async getRoleById(id: string): Promise<RoleResponseDto> {
    return await this.roleService.findById(id);
  }

  private async getAnonymous() {
    const result = [await this.getRoleById('5dc9bbffa68eed83b62d0e4c')];
    if (result[0] == undefined) {
      throw new NotImplementedException(
        'There are missing roles in the database.',
      );
    }
    return result;
  }
}
