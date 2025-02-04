/* eslint-disable no-unused-vars */
import { Controller, Post, Body, UseGuards, Get, Param, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

import { ThrottlerGuard } from '@nestjs/throttler';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

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
  @ApiOperation({ summary: 'Login a user' }) 
  @ApiBody({
    type: LoginDto, // Specifies the DTO class for the request body
    examples: {
      example1: {
        summary: 'Example of a login request',
        value: {
          email: 'maha.abid@insat.ucar.tn',
          password: 'Azer123456789*',
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
  @ApiOperation({
    summary: 'Verify user email',
    description: "Verifies a user's email address using a verification token.",
  })
  @ApiParam({
    name: 'token',
    description: 'Email verification token',
    example: 'abc123',
  })
  @ApiResponse({ status: 200, description: 'Email verified successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token.' })
  async verifyEmail(@Param('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post('password-reset/initiate')
  @ApiOperation({
    summary: 'Initiate password reset',
    description: "Sends a password reset link to the user's email.",
  })
  @ApiBody({ schema: { example: { email: 'user@example.com' } } })
  @ApiResponse({
    status: 200,
    description: 'Password reset email sent successfully.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async initiatePasswordReset(@Body('email') email: string) {
    return this.authService.initiatePasswordReset(email);
  }

  @Post('password-reset/complete')
  @ApiOperation({
    summary: 'Complete password reset',
    description: "Resets the user's password using a valid reset token.",
  })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 200, description: 'Password reset successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token.' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }


    @ApiOperation({
      summary: 'Logout',
      description: 'Logout and clear the token',
    })
    @UseGuards(AuthGuard('jwt'))
    @Post('logout')
    logout(@Req() req: Request, @Res() res: Response) {
      res.cookie('access_token', '', { expires: new Date(0) }); 
      return res.status(200).json({ message: 'Logged out successfully' });
    }


}
