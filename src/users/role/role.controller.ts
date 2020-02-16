import {
  Controller,
  Get,
  Query,
  Param,
  Post,
  Body,
  ValidationPipe,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { RoleService } from './role.service';
import {
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CreateRoleRequestDto } from './dto/create-role-request.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoleResponseDto } from './role-response.dto';
import { ConflictException } from '@nestjs/common';
import { UseRoles } from 'nest-access-control/lib';
import { AccessGuard } from '../access/access.guard';

@Controller('role')
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @ApiOperation({ title: 'Get collection of roles.' })
  @UseRoles({ resource: 'role', action: 'read', possession: 'any' })
  @UseGuards(AuthGuard('bearer'), AccessGuard)
  @ApiOkResponse({
    description: 'Collection of roles has been retrieved',
    type: [RoleResponseDto],
  })
  public findAll(@Query('skip') skip: string) {
    return this.roleService.findAll(parseInt(skip, 0));
  }

  @Get(':id')
  @ApiOperation({ title: 'Find role by id' })
  @UseRoles({ resource: 'role', action: 'read', possession: 'any' })
  @UseGuards(AuthGuard('bearer'), AccessGuard)
  @ApiOkResponse({
    description: 'Required role has been retrieved',
    type: RoleResponseDto,
  })
  public findById(@Param('id') id: string) {
    return this.roleService.findById(id);
  }

  @Post()
  @ApiOperation({ title: 'Create new role' })
  @UseRoles({ resource: 'role', action: 'create', possession: 'any' })
  @UseGuards(AuthGuard('bearer'), AccessGuard)
  @ApiCreatedResponse({
    description: 'Role has been succesfully created',
    type: RoleResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Role creations requires authetification.',
  })
  @ApiConflictResponse({
    description: 'Role already exists.',
  })
  public async create(
    @Body(new ValidationPipe({ transform: true }))
    createRoleRequestDto: CreateRoleRequestDto,
  ): Promise<RoleResponseDto | ConflictException> {
    return await this.roleService.create(createRoleRequestDto);
  }

  @Delete(':id')
  @ApiOperation({ title: 'Delete role by id' })
  @UseRoles({ resource: 'role', action: 'delete', possession: 'any' })
  @UseGuards(AuthGuard('bearer'), AccessGuard)
  @ApiOkResponse({
    description: 'Role has been successfully deleted',
    type: RoleResponseDto,
  })
  public delete(@Param('id') id: string) {
    return this.roleService.delete(id);
  }
}
