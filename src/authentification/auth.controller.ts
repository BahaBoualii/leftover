import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, ResetPasswordDto } from './dto/auth.dto';

import { ThrottlerGuard } from '@nestjs/throttler';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' }) // Adds a summary for the endpoint
  @ApiBody({
    type: RegisterDto, // Specifies the DTO class for the request body
    examples: {
      example1: {
        summary: 'Example of a registration request',
        value: {
          firstName: 'maha',
          lastName: 'abid',
          phoneNumber: '123456',
          email: 'maha.abid@insat.ucar.tn',
          password: 'Azer123456789*',
          role: 'admin',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' }) // Adds a summary for the endpoint
  @ApiBody({
    type: LoginDto, // Specifies the DTO class for the request body
    examples: {
      example1: {
        summary: 'Example of a login request',
        value: {
          email: 'maha.abid@insat.ucar.tn',
          password: 'TunisiaTulsa2023*',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
