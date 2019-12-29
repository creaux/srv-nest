import {
  Controller,
  Get,
  Inject,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderResponse } from '../dto/order-response.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ParseObjectIdPipe } from '../../../pipes/parse-object-id.pipe';
import { ParseNumberPipe } from '../../../pipes/parse-number.pipe';
import { AccessGuard } from '../../../users/access.guard';
import { RolesBuilder, UseRoles } from 'nest-access-control/lib';
import { Call } from '../../../decorators/call.decorator';
import { UserByBearerPipe } from '../../../auth/pipes/user-by-bearer.pipe';
import { UserResponseDto } from '../../../users/user/dto/create-user-response.dto';
import { RoleModel } from '@pyxismedia/lib-model';
import { ROLES_BUILDER_TOKEN } from 'nest-access-control/lib';

@Controller('commerce/order')
@ApiBearerAuth()
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    @Inject(ROLES_BUILDER_TOKEN) private readonly rolesBuilder: RolesBuilder,
  ) {}

  @Get()
  @ApiOperation({ title: 'Request order collection' })
  @UseGuards(AccessGuard)
  @UseRoles(
    { resource: 'order', action: 'read', possession: 'own' },
    { resource: 'order', action: 'read', possession: 'any' },
  )
  public async findAll(
    @Query('skip', ParseNumberPipe) skip: number,
    @Call(UserByBearerPipe) user: UserResponseDto,
  ): Promise<OrderResponse[]> {
    const { roles, id } = user;
    const names = roles.map((role: RoleModel) => role.name);
    const readAny = names.some(
      (role: string) => this.rolesBuilder.can(role).readAny('order').granted,
    );

    if (readAny) {
      return await this.orderService.findAll(skip);
    }

    return this.orderService.findAllByUserId(id);
  }

  @Get(':id')
  @UseGuards(AccessGuard)
  @UseRoles(
    { resource: 'order', action: 'read', possession: 'own' },
    { resource: 'order', action: 'read', possession: 'any' },
  )
  public async findById(
    @Param('id', ParseObjectIdPipe) id: string,
    @Call(UserByBearerPipe) user: UserResponseDto,
  ): Promise<OrderResponse> {
    const { roles, id: userId } = user;
    const names = roles.map((role: RoleModel) => role.name);
    const readAny = names.some(
      (role: string) => this.rolesBuilder.can(role).readAny('order').granted,
    );

    if (readAny) {
      return await this.orderService.findById(id);
    }

    return await this.orderService.findByUserSomeId(userId, id);
  }
}
