import { Body, Controller, Post, ForbiddenException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSignInRequestDto } from './dto/auth-sign-in-request.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthSignInResponseDto } from './dto/auth-sign-in-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  @ApiOperation({ title: 'Authentificate' })
  @ApiResponse({
    status: 201,
    description: 'You have been successfully authentificated.',
  })
  async signIn(
    @Body() signIn: AuthSignInRequestDto,
  ): Promise<AuthSignInResponseDto | ForbiddenException> {
    return await this.authService.signIn(signIn);
  }
}
