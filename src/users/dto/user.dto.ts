import { IsEmail, IsString, IsEnum, IsArray, IsOptional } from 'class-validator';
import { Role } from 'src/common/enum/role.enum';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsArray()
  @IsEnum(Role, { each: true })
  roles: Role[];

  @IsString()
  @IsOptional()
  verificationToken?: string;

  @IsOptional()
  isVerified?: boolean;
}