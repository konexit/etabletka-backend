import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export default class AuthDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(13)
  login: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
