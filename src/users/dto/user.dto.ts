import { ApiProperty, PartialType } from '@nestjs/swagger';
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
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password for the user account',
  })
  @IsString()
  password: string;

  @ApiProperty({ example: 'John', description: 'First name of the user' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  @IsString()
  lastName: string;

  @ApiProperty({
    type: CreateLocationDto,
    description: 'Location details of the user',
  })
  location: CreateLocationDto;

  @ApiProperty({
    example: [Role.USER, Role.ADMIN],
    description: 'Roles assigned to the user',
    enum: Role,
    isArray: true,
  })
  @IsArray()
  @IsEnum(Role, { each: true })
  roles: Role[];

  @ApiProperty({
    example: 'some-verification-token',
    description: 'Token for email verification',
    required: false,
  })
  @IsString()
  @IsOptional()
  verificationToken?: string;

  @ApiProperty({
    example: false,
    description: 'Whether the user is verified',
    required: false,
  })
  @IsOptional()
  isVerified?: boolean;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
