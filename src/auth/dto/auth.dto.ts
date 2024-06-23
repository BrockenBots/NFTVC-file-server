import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from '@nestjs/class-validator';
import { UserDto } from 'src/users/dto/user.dto';
import { Request } from 'express';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class UserRequest extends Request {
  user: UserDto;
  cookies: any;
}
