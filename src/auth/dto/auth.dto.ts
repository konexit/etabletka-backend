import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export default class AuthDto {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
