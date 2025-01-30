import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, Matches, IsEnum } from 'class-validator';
import { Role } from 'src/common/enum/role.enum';

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description:
      'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number or special character.',
  })
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must contain uppercase, lowercase, number/special character',
  })
  password: string;

  @ApiProperty({
    example: Role.USER,
    description: 'Role of the user',
    enum: Role,
  })
  @IsEnum(Role, {
    message: 'Role must be one of the following: admin, store_admin, user',
  })
  role: Role;
}
