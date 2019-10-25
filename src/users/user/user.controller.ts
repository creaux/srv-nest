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
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequestDto } from './create-user-request.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation } from '@nestjs/swagger';
import { ConflictException, ValidationPipe } from '@nestjs/common';
import { UserResponseDto } from './create-user-response.dto';
import { DeserializePipe } from '../../pipes/deserialize.pipe';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
@UseGuards(AuthGuard('bearer'))
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
  async createUser(
    @Body(new ValidationPipe({ transform: true }))
    userCreateDto: CreateUserRequestDto,
  ): Promise<UserResponseDto | ConflictException> {
    return await this.userService.createUser(userCreateDto);
  }
}
