import { IsString, IsNotEmpty, MinLength, IsOptional } from 'class-validator';
export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(13)
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;
}
