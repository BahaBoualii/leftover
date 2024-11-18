import { IsEmail, IsString, MinLength, Matches,IsEnum } from 'class-validator';
import { Role } from 'src/common/enum/role.enum';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password must contain uppercase, lowercase, number/special character',
  })
  password: string;

  @IsEnum(Role, {
    message: 'Role must be one of the following: admin, store_admin, user',
  })
  role: Role;
}



export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password must contain uppercase, lowercase, number/special character',
  })
  newPassword: string;
}