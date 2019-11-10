import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Request,
  UnauthorizedException,
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
import { RoleModel } from '@pyxismedia/lib-model';
import { RoleResponseDto } from './role/role-response.dto';
import { UserResponseDto } from './user/create-user-response.dto';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly reflector: Reflector,
    @InjectRolesBuilder() private readonly roleBuilder: RolesBuilder,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const { authorization } = request.headers as any;

    // Provided in header by client
    if (authorization) {
      const token = this.getBearerFromAuthorization(authorization);
      const userId = await this.getUserIdByToken(token);

      // Authentification exists in database
      if (userId) {
        const userRoles = await this.getRolesByUserId(userId);
        const roles = this.reflector.get<Role[]>('roles', context.getHandler());

        const hasRoles = roles.every(role => {
          const queryInfo: IQueryInfo = role;
          queryInfo.role = userRoles.map(
            (userRole: RoleResponseDto) => userRole.name,
          );
          const permission = this.roleBuilder.permission(queryInfo);
          return permission.granted;
        });
        return hasRoles;
      }
    }
    return true;
  }

  private getBearerFromAuthorization(authorization: string): string {
    return authorization.split(' ')[1];
  }

  private async getUserIdByToken(token: string): Promise<string> {
    const auth = await this.authService.validateUser(token);
    if (auth && auth.userId) {
      return auth.userId;
    }
    return null;
  }

  private async getRolesByUserId(userId: string): Promise<RoleResponseDto[]> {
    const user = await this.userService.findById(userId);
    if (user && user.roles) {
      return user.roles;
    }
    return null;
  }

  // protected async getUser(context: ExecutionContext): Promise<User> {
  //   const request = context.switchToHttp().getRequest();
  //   return request.user;
  // }
  //
  // protected async getUserRoles(context: ExecutionContext): Promise<string | string[]> {
  //   const user = await this.getUser(context);
  //   if (!user) throw new UnauthorizedException();
  //   return user.roles;
  // }

  // public async canActivate(context: ExecutionContext): Promise<boolean> {
  //   const roles = this.reflector.get<Role[]>('roles', context.getHandler());
  //   if (!roles) {
  //     return true;
  //   }
  //
  //   const userRoles = await this.getUserRoles(context);
  //   const hasRoles = roles.every(role => {
  //     const queryInfo: IQueryInfo = role;
  //     queryInfo.role = userRoles;
  //     const permission = this.roleBuilder.permission(queryInfo);
  //     return permission.granted;
  //   });
  //   return hasRoles;
  // }
}
