import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSignInDto } from './auth.types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  async signIn(@Body() signIn: AuthSignInDto) {
    return await this.authService.signIn(signIn);
  }
}
