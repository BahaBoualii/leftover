import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/user.service';
import { MailService } from '../mailing/mail.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto, ResetPasswordDto } from './dto/auth.dto';
import { v4 as uuidv4 } from 'uuid';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, role } = registerDto;

    // Check if user exists
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Generate verification token
      const verificationToken = uuidv4();

      // Create user
      const user = await this.usersService.create({
        email,
        password: hashedPassword,
        role: role,
        verificationToken,
        isVerified: false,
      });

      console.log('USer:', user);

      // Send verification email
      await this.mailService.sendVerificationEmail(email, verificationToken);

      return {
        message:
          'Registration successful. Please check your email to verify your account.',
        userId: user.id,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Registration failed. Please try again.');
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    try {
      // Find user and include roles
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Check if user is verified
      if (!user.isVerified) {
        throw new UnauthorizedException('Please verify your email first');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Generate JWT token with roles
      const payload: JwtPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };

      const token = this.jwtService.sign(payload);

      return {
        access_token: token,
        user: {
          id: user.id,
          email: user.email,
          roles: user.role,
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException('Login failed. Please try again.');
    }
  }

  async verifyEmail(token: string) {
    try {
      const user = await this.usersService.findByVerificationToken(token);
      if (!user) {
        throw new BadRequestException('Invalid verification token');
      }

      await this.usersService.markEmailAsVerified(user.id);
      return { message: 'Email verified successfully' };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Email verification failed');
    }
  }

  async initiatePasswordReset(email: string) {
    try {
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        // Return success message even if user not found for security
        return { message: 'Password reset instructions sent to your email' };
      }

      const resetToken = uuidv4();
      await this.usersService.setResetToken(user.id, resetToken);
      await this.mailService.sendPasswordResetEmail(email, resetToken);

      return { message: 'Password reset instructions sent to your email' };
    } catch (error) {
      throw new BadRequestException('Password reset initiation failed');
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, newPassword } = resetPasswordDto;

    try {
      const user = await this.usersService.findByResetToken(token);
      if (!user) {
        throw new BadRequestException('Invalid reset token');
      }

      // Check if token is expired
      if (user.resetTokenExpiry && user.resetTokenExpiry < new Date()) {
        throw new BadRequestException('Reset token has expired');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await this.usersService.updatePassword(user.id, hashedPassword);
      await this.usersService.clearResetToken(user.id);

      return { message: 'Password reset successful' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Password reset failed');
    }
  }
}
