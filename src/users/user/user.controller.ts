import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserModel, UserCreate } from './user.types';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async findAll(@Query('skip') skip: string) {
    return await this.userService.findAll(parseInt(skip, 0));
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.userService.findById(id);
  }

  @Post()
  @UseGuards(AuthGuard('bearer'))
  async createUser(@Body() { forname, surname, email, password }: UserCreate) {
    const userCreate = new UserCreate(forname, surname, email, password);
    return await this.userService.createUser(userCreate);
  }
}
