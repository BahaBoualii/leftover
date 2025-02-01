/* eslint-disable no-unused-vars */
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Put,
  Param,
  Get,
  NotFoundException,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { Store, StoreCategory } from './entities/store.entity';

@ApiTags('Store')
@ApiBearerAuth('access-token')
@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new store' })
  @ApiBody({
    description: 'Data required to create a new store',
    type: CreateStoreDto,
  })
  @ApiResponse({
    status: 201,
    description: 'The store has been successfully registered.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles([Role.STORE_ADMIN, Role.USER])
  async registerStore(@Body() createStoreDto: CreateStoreDto, @Request() req) {
    const userId = req.user.id;
    return this.storeService.createStore(createStoreDto, userId);
  }

  @Get(':storeId/surprise-bags')
  @ApiOperation({
    summary: 'Get all surprise bags in a store',
    description: 'Retrieves all surprise bags available in a specific store.',
  })
  @ApiParam({
    name: 'storeId',
    description: 'ID of the store',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'List of surprise bags retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Store not found.' })
  async getSurpriseBagsByStore(@Param('storeId') storeId: string) {
    const surpriseBags =
      await this.storeService.getSurpriseBagsByStore(storeId);
    if (!surpriseBags) {
      throw new NotFoundException('Store not found');
    }
    return surpriseBags;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update store profile' })
  @ApiParam({
    name: 'id',
    required: true,
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the store to update',
  })
  @ApiBody({
    description: 'Data required to update the store',
    type: UpdateStoreDto,
  })
  @ApiResponse({
    status: 200,
    description: 'The store profile has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Store not found.' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles([Role.STORE_ADMIN])
  async updateStore(
    @Param('id') storeId: string,
    @Body() updateStoreDto: UpdateStoreDto,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.storeService.updateStore(storeId, updateStoreDto, userId);
  }

  @Put(':id/verify')
  @ApiOperation({ summary: 'Verify a store' })
  @ApiParam({
    name: 'id',
    required: true,
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the store to verify',
  })
  @ApiResponse({
    status: 200,
    description: 'The store has been successfully verified.',
  })
  @ApiResponse({ status: 404, description: 'Store not found.' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles([Role.ADMIN])
  async verifyStore(@Param('id') storeId: string) {
    return this.storeService.verifyStore(storeId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get store details' })
  @ApiParam({
    name: 'id',
    required: true,
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the store to retrieve',
  })
  @ApiResponse({
    status: 200,
    description: 'The store details have been successfully retrieved.',
    type: Store,
  })
  @ApiResponse({ status: 404, description: 'Store not found.' })
  @UseGuards(AuthGuard('jwt'))
  async getStore(@Param('id') storeId: string): Promise<Store> {
    return this.storeService.getStoreById(storeId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all stores' })
  @ApiResponse({
    status: 200,
    description: 'The list of stores has been successfully retrieved.',
    type: [Store],
  })
  @UseGuards(AuthGuard('jwt'))
  async getAllStores(): Promise<Store[]> {
    return this.storeService.getAllStores();
  }

  @Get('search')
  @ApiOperation({
    summary: 'Search nearby stores',
    description: 'Search for stores near a given location.',
  })
  @ApiResponse({ status: 200, description: 'List of nearby stores.' })
  async searchNearbyStores(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Query('radius') radius: number,
    @Query('category') category?: StoreCategory,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.storeService.searchNearbyStores(
      latitude,
      longitude,
      radius,
      category,
      sortBy,
      sortOrder,
      page,
      limit,
    );
  }

  @Get('featured')
  @ApiOperation({
    summary: 'Get featured stores',
    description: 'Returns a list of featured stores.',
  })
  @ApiResponse({ status: 200, description: 'List of featured stores.' })
  async getFeaturedStores() {
    return this.storeService.getFeaturedStores();
  }
}
