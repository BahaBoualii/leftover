import { IsNotEmpty, IsEnum, IsString, IsOptional } from 'class-validator';
import { StoreCategory } from '../entities/store.entity';
import { Location } from 'src/location/entities/location.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStoreDto {
  @ApiProperty({
    description: 'Name of the store',
    example: 'Amazing Store',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  storeName: string;

  @ApiProperty({
    description: 'Description of the store',
    example: 'A store offering amazing products',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Category of the store',
    example: 'ELECTRONICS',
    enum: StoreCategory,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(StoreCategory)
  category: StoreCategory;

  @ApiProperty({
    description: 'Photo URL of the store',
    example: 'http://example.com/photo.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  photoUrl?: string;

  @ApiProperty({
    description: 'Location of the store',
    example: {
      city: 'Tunis',
      address: '123 Main Street',
      latitude: 36.8065,
      longitude: 10.1815,
      postalCode: '1000',
      country: 'Tunisia',
    },
    type: Location,
    required: true,
  })
  @IsNotEmpty()
  location: Location;
}
