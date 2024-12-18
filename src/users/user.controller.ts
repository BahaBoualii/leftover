import {
  Controller,
  Get,
  UseGuards,
  Request,
  ForbiddenException,
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
      return await this.usersService.findById(req.user.userId);
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
      return await this.usersService.findAll();
    } catch {
      throw new ForbiddenException('Unable to retrieve users');
    }
  }
}
