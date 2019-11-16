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
import { RoleService } from './role/role.service';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly reflector: Reflector,
    @InjectRolesBuilder() private readonly roleBuilder: RolesBuilder,
    private readonly roleService: RoleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    // Provided in header by client
    const { authorization } = request.headers as any;
    const token = this.getBearerFromAuthorization(authorization);
    const userId = await this.getUserIdByToken(token);
    // Authentification exists in database
    let userRoles: RoleResponseDto[] = await this.getRolesByUserId(userId);
    const roles = this.reflector.get<Role[]>('roles', context.getHandler());
    return await roles.every(async role => {
      const queryInfo: IQueryInfo = role;
      if (userRoles instanceof Array) {
        if (userRoles.length === 0) {
          // Anonymous role
          userRoles = [await this.getRoleById('5dd01264190889c64407fe22')];
        }
        queryInfo.role = userRoles.map(
          (userRole: RoleResponseDto) => userRole.name,
        );
        const permission = this.roleBuilder.permission(queryInfo);
        return permission.granted;
      }
      // TODO: Add 'Anonymous' role
      return false;
    });
  }

  private getBearerFromAuthorization(
    authorization: string | undefined,
  ): string | null {
    if (typeof authorization === 'string') {
      return authorization.split(' ')[1];
    }
    return null;
  }

  private async getUserIdByToken(token: string | null): Promise<string | null> {
    if (typeof token === 'string') {
      const auth = await this.authService.validateUser(token);
      if (auth && auth.userId) {
        return auth.userId;
      }
    }
    return null;
  }

  private async getRolesByUserId(
    userId: string | null,
  ): Promise<RoleResponseDto[]> {
    if (typeof userId === 'string') {
      const user = await this.userService.findById(userId);
      if (user && user.roles) {
        return user.roles;
      }
    }
    return [];
  }

  private async getRoleById(id: string): Promise<RoleResponseDto> {
    return await this.roleService.findById(id);
  }
}
