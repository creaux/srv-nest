import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiBearerAuth, ApiImplicitQuery } from '@nestjs/swagger';
import { ConflictException, ValidationPipe } from '@nestjs/common';
import { UserResponseDto } from './dto/create-user-response.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
@UseGuards(AuthGuard('bearer'))
@ApiBearerAuth()
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiOperation({ title: 'Request users collection' })
  async findAll(@Query('skip') skip: string): Promise<UserResponseDto[]> {
    return await this.userService.findAll(parseInt(skip, 0));
  }

  @Get(':id')
  @ApiOperation({ title: 'Request user by id' })
  findById(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.findById(id);
  }

  // TODO: Middleware for creating Dto objects from params NOTE: This should be done by this https://docs.nestjs.com/techniques/serialization
  @Post()
  @ApiOperation({ title: 'Create user' })
  createUser(
    @Body(new ValidationPipe({ transform: true }))
    userCreateDto: CreateUserRequestDto,
  ): Promise<UserResponseDto | ConflictException> {
    return this.userService.createUser(userCreateDto);
  }
}
