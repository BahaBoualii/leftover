import {
  Controller,
  Get,
  UseGuards,
  Request,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { JwtAuthGuard } from '../authentification/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enum/role.enum';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiResponse({ status: 200, description: 'Returns the user profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Request() req) {
    try {
      const user = await this.usersService.findById(req.user.userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Remove sensitive information
      const { password, resetToken, resetTokenExpiry, ...result } = user;
      return result;
    } catch {
      throw new ForbiddenException('Unable to retrieve profile');
    }
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiResponse({ status: 200, description: 'Returns all users' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  async findAll() {
    try {
      const users = await this.usersService.findAll();
      return users
    } catch {
      throw new ForbiddenException('Unable to retrieve users');
    }
  }
}
