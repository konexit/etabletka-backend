import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export default class AuthDto {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsOptional()
  @Transform(({ value })=> value === 'true')
  rememberMe?: boolean
}
