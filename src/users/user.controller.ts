/* eslint-disable no-unused-vars */
import {
  Controller,
  Get,
  UseGuards,
  Request,
  ForbiddenException,
  Patch,
  Body,
  Param,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { JwtAuthGuard } from '../authentification/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enum/role.enum';
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { UpdateUserDto } from './dto/user.dto';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({
    summary: 'Get user profile',
    description: 'Returns the profile of the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getProfile(@Request() req) {
    try {
      return await this.usersService.findById(req.user.userId);
    } catch {
      throw new ForbiddenException('Unable to retrieve profile');
    }
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update user profile',
    description: 'Updates the profile of the authenticated user.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the user to update',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. User can only update their own profile.',
  })
  async updateProfile(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateProfile(id, updateUserDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Get all users',
    description: 'Returns a list of all users. Only accessible by admins.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of users retrieved successfully.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Only admins can access this endpoint.',
  })
  async findAll() {
    try {
      return await this.usersService.findAll();
    } catch {
      throw new ForbiddenException('Unable to retrieve users');
    }
  }
}
