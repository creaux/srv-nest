import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiImplicitParam,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ParseObjectIdPipe } from '../../pipes/parse-object-id.pipe';
import { ParseNumberPipe } from '../../pipes/parse-number.pipe';
import { AccessGuard } from '../../users/access/access.guard';
import { RolesBuilder, UseRoles } from 'nest-access-control/lib';
import { Call } from '../../decorators/call.decorator';
import { UserByBearerPipe } from '../../auth/pipes/user-by-bearer.pipe';
import { UserResponseDto } from '../../users/user/dto/create-user-response.dto';
import { RoleModel } from '@pyxismedia/lib-model';
import { ROLES_BUILDER_TOKEN } from 'nest-access-control/lib';
import { ValidationPipe } from '../../pipes/validation.pipe';
import {
  CreateOrderRequestDto,
  UpdateOrderRequestDto,
  OrderResponseDto,
} from './dto';
import { Types } from 'mongoose';

@Controller('store/order')
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
  ): Promise<OrderResponseDto[]> {
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
  @ApiOperation({ title: 'Requests order by id' })
  @UseGuards(AccessGuard)
  @UseRoles(
    { resource: 'order', action: 'read', possession: 'own' },
    { resource: 'order', action: 'read', possession: 'any' },
  )
  public async findById(
    @Param('id', ParseObjectIdPipe) id: string,
    @Call(UserByBearerPipe) user: UserResponseDto,
  ): Promise<OrderResponseDto> {
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

  @Post()
  @ApiOperation({ title: 'Create new order' })
  @UseGuards(AccessGuard)
  @UseRoles(
    { resource: 'order', action: 'create', possession: 'own' },
    { resource: 'order', action: 'create', possession: 'any' },
  )
  public async create(
    @Body(ValidationPipe) createOrderRequest: CreateOrderRequestDto,
    @Call(UserByBearerPipe) user: UserResponseDto,
  ): Promise<OrderResponseDto> {
    createOrderRequest.set('user', user.id);
    createOrderRequest.set('createdAt', new Date().toDateString());
    return await this.orderService.create(createOrderRequest);
  }

  @Delete(':orderId')
  @ApiOperation({ title: 'Delete order by id' })
  @UseGuards(AccessGuard)
  @UseRoles({ resource: 'order', action: 'delete', possession: 'any' })
  public async deleteById(
    @Param('orderId', ParseObjectIdPipe) id: string,
  ): Promise<OrderResponseDto> {
    return this.orderService.deleteById(id);
  }

  @Put(':orderId')
  @ApiOperation({ title: 'Update order by id' })
  @UseGuards(AccessGuard)
  @UseRoles({ resource: 'order', action: 'update', possession: 'any' })
  @ApiResponse({
    status: 201,
    description: 'Order has been successfully updated.',
  })
  @ApiForbiddenResponse({
    description:
      'You cannot update own order when it has been already created.',
  })
  public async updateById(
    @Param('orderId', ParseObjectIdPipe) id: string,
    @Body(ValidationPipe) updateOrderRequest: UpdateOrderRequestDto,
  ) {
    return this.orderService.updateById(id, updateOrderRequest);
  }

  @Put(':orderId/:productId')
  @ApiOperation({ title: 'Add product to existing order' })
  @UseGuards(AccessGuard)
  @UseRoles({ resource: 'order', action: 'update', possession: 'any' })
  @ApiResponse({
    status: 201,
    description: 'Order has been successfully updated.',
  })
  @ApiForbiddenResponse({
    description:
      'You cannot update own order when it has been already created.',
  })
  public async addProductToOrder(
    @Param('orderId', ParseObjectIdPipe) orderId: string,
    @Param('productId', ParseObjectIdPipe) productId: string,
  ) {
    return await this.orderService.addProductToOrder(orderId, productId);
  }

  @Delete(':orderId/:productId')
  @ApiOperation({ title: 'Delete product from existing order' })
  @ApiImplicitParam({
    name: 'orderId',
    description: 'mongo object identifier of existing order',
    required: true,
    type: Types.ObjectId,
  })
  @ApiImplicitParam({
    name: 'productId',
    description: 'mongo object identifier of existing product',
    required: true,
    type: Types.ObjectId,
  })
  @UseGuards(AccessGuard)
  @UseRoles({ resource: 'order', action: 'update', possession: 'any' })
  @ApiForbiddenResponse({
    description: 'user with posession own is not able to make update',
  })
  public async removeProductFromOrder(
    @Param('orderId', ParseObjectIdPipe) orderId: string,
    @Param('productId', ParseObjectIdPipe) productId: string,
  ) {
    return await this.orderService.removeProductFromOrder(orderId, productId);
  }
}
