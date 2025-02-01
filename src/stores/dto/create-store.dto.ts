import { IsNotEmpty, IsEnum, IsString, IsOptional } from 'class-validator';
import { StoreCategory } from '../entities/store.entity';
import { Location } from 'src/location/entities/location.entity';

export class CreateStoreDto {
  @IsNotEmpty()
  @IsString()
  storeName: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(StoreCategory)
  category: StoreCategory;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsNotEmpty()
  location: Location
}