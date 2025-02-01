import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Put,
  Param,
  Get,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBearerAuth, // Add this decorator
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { Store } from './entities/store.entity';

@ApiTags('Store')
@ApiBearerAuth() // Add this to enable token authentication for all endpoints in the controller
@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new store' })
  @ApiBody({ type: CreateStoreDto })
  @ApiResponse({ status: 201, description: 'The store has been successfully registered.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles([Role.STORE_ADMIN, Role.USER])
  async registerStore(@Body() createStoreDto: CreateStoreDto, @Request() req) {
    const userId = req.user.id;
    return this.storeService.createStore(createStoreDto, userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update store profile' })
  @ApiParam({ name: 'id', required: true, example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID of the store to update' })
  @ApiBody({ type: UpdateStoreDto })
  @ApiResponse({ status: 200, description: 'The store profile has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Store not found.' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles([Role.STORE_ADMIN])
  async updateStore(@Param('id') storeId: string, @Body() updateStoreDto: UpdateStoreDto, @Request() req) {
    const userId = req.user.id;
    return this.storeService.updateStore(storeId, updateStoreDto, userId);
  }

  @Put(':id/verify')
  @ApiOperation({ summary: 'Verify a store' })
  @ApiParam({ name: 'id', required: true, example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID of the store to verify' })
  @ApiResponse({ status: 200, description: 'The store has been successfully verified.' })
  @ApiResponse({ status: 404, description: 'Store not found.' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles([Role.ADMIN])
  async verifyStore(@Param('id') storeId: string) {
    return this.storeService.verifyStore(storeId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get store details' })
  @ApiParam({ name: 'id', required: true, example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID of the store to retrieve' })
  @ApiResponse({ status: 200, description: 'The store details have been successfully retrieved.' })
  @ApiResponse({ status: 404, description: 'Store not found.' })
  @UseGuards(AuthGuard('jwt'))
  async getStore(@Param('id') storeId: string): Promise<Store> {
    return this.storeService.getStoreById(storeId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all stores' })
  @ApiResponse({ status: 200, description: 'The list of stores has been successfully retrieved.' })
  @UseGuards(AuthGuard('jwt'))
  async getAllStores(): Promise<Store[]> {
    return this.storeService.getAllStores();
  }
}