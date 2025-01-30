import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, Matches } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'reset-token-123',
    description: 'Token received for password reset',
  })
  @IsString()
  token: string;

  @ApiProperty({
    example: 'NewPassword123!',
    description:
      'New password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number or special character.',
  })
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must contain uppercase, lowercase, number/special character',
  })
  newPassword: string;
}
