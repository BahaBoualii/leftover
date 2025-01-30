/* eslint-disable no-unused-vars */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { SurpriseBagService } from './surprise-bags.service';
import { CreateSurpriseBagDto } from './dto/create-surprise-bag.dto';
import { UpdateSurpriseBagDto } from './dto/update-surprise-bag.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('surprise-bags')
@Controller('surprise-bags')
export class SurpriseBagController {
  constructor(private readonly surpriseBagService: SurpriseBagService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new surprise bag',
    description: 'Creates a new surprise bag for a store.',
  })
  @ApiBody({ type: CreateSurpriseBagDto })
  @ApiQuery({
    name: 'storeId',
    required: true,
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the store creating the bag',
  })
  @ApiResponse({
    status: 201,
    description: 'The surprise bag has been successfully created.',
  })
  @ApiResponse({ status: 404, description: 'Store not found.' })
  create(
    @Body() createSurpriseBagDto: CreateSurpriseBagDto,
    @Query('storeId') storeId: string,
  ) {
    return this.surpriseBagService.create(createSurpriseBagDto, storeId);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all surprise bags',
    description: 'Retrieves a list of all surprise bags.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of surprise bags retrieved successfully.',
  })
  findAll() {
    return this.surpriseBagService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a surprise bag by ID',
    description: 'Retrieves a specific surprise bag by its ID.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the surprise bag',
  })
  @ApiResponse({
    status: 200,
    description: 'Surprise bag retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Surprise bag not found.' })
  findOne(@Param('id') id: string) {
    return this.surpriseBagService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a surprise bag',
    description: 'Updates a specific surprise bag by its ID.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the surprise bag',
  })
  @ApiBody({ type: UpdateSurpriseBagDto })
  @ApiResponse({
    status: 200,
    description: 'Surprise bag updated successfully.',
  })
  @ApiResponse({ status: 404, description: 'Surprise bag not found.' })
  update(
    @Param('id') id: string,
    @Body() updateSurpriseBagDto: UpdateSurpriseBagDto,
  ) {
    return this.surpriseBagService.update(id, updateSurpriseBagDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a surprise bag',
    description: 'Deletes a specific surprise bag by its ID.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the surprise bag',
  })
  @ApiResponse({
    status: 200,
    description: 'Surprise bag deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Surprise bag not found.' })
  remove(@Param('id') id: string) {
    return this.surpriseBagService.remove(id);
  }

  @Put(':id/inventory')
  @ApiOperation({
    summary: 'Update inventory of a surprise bag',
    description: 'Updates the inventory quantity of a specific surprise bag.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the surprise bag',
  })
  @ApiQuery({
    name: 'quantity',
    required: true,
    example: 5,
    description: 'New quantity of the surprise bag',
  })
  @ApiResponse({ status: 200, description: 'Inventory updated successfully.' })
  @ApiResponse({ status: 404, description: 'Surprise bag not found.' })
  updateInventory(
    @Param('id') id: string,
    @Query('quantity') quantity: number,
  ) {
    return this.surpriseBagService.updateInventory(id, quantity);
  }
}
