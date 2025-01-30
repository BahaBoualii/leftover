import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { MealType } from 'src/common/enum/meal-type.enum';
import { BagStatus } from 'src/common/enum/bag-status.enum';

export class CreateSurpriseBagDto {
  @ApiProperty({
    example: 'Veggie Delight Bag',
    description: 'Name of the surprise bag',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'A bag full of fresh veggies',
    description: 'Description of the surprise bag',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 25.99, description: 'Original value of the bag' })
  @IsNotEmpty()
  @IsNumber()
  originalValue: number;

  @ApiProperty({ example: 15.99, description: 'Discounted price of the bag' })
  @IsNotEmpty()
  @IsNumber()
  discountedPrice: number;

  @ApiProperty({ example: 10, description: 'Quantity of bags available' })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({
    enum: MealType,
    example: MealType.GROCERIES,
    description: 'Type of meal',
  })
  @IsNotEmpty()
  @IsEnum(MealType)
  mealType: MealType;

  @ApiProperty({
    example: ['nuts', 'gluten'],
    description: 'List of allergens',
  })
  @IsNotEmpty()
  @IsArray()
  allergenInfo: string[];

  @ApiProperty({
    example: '2023-12-01T10:00:00Z',
    description: 'Start time for pickup',
  })
  @IsNotEmpty()
  @IsDateString()
  pickupStart: Date;

  @ApiProperty({
    example: '2023-12-01T18:00:00Z',
    description: 'End time for pickup',
  })
  @IsNotEmpty()
  @IsDateString()
  pickupEnd: Date;

  @ApiProperty({
    enum: BagStatus,
    example: BagStatus.AVAILABLE,
    description: 'Status of the bag',
  })
  @IsNotEmpty()
  @IsEnum(BagStatus)
  status: BagStatus;
}
