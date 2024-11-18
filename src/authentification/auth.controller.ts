import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, ResetPasswordDto } from './dto/auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('Auth')
@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('verify/:token')
  async verifyEmail(@Param('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post('password-reset/initiate')
  async initiatePasswordReset(@Body('email') email: string) {
    return this.authService.initiatePasswordReset(email);
  }

  @Post('password-reset/complete')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
