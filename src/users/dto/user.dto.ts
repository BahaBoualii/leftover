import { PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsEnum,
  IsArray,
  IsOptional,
} from 'class-validator';
import { Role } from 'src/common/enum/role.enum';
import { CreateLocationDto } from 'src/location/dto/location.dto';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  location: CreateLocationDto

  @IsArray()
  @IsEnum(Role, { each: true })
  roles: Role[];

  @IsString()
  @IsOptional()
  verificationToken?: string;

  @IsOptional()
  isVerified?: boolean;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}