import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export default class AuthDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(13)
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
