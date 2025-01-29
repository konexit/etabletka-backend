import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAnotherPoint {
  @IsString()
  @MinLength(1)
  name: string;

  @IsOptional()
  @IsString()
  @MinLength(7)
  @MaxLength(7)
  mainColor: string;

  @IsOptional()
  @IsString()
  @MinLength(7)
  @MaxLength(7)
  backColor: string;

  @IsOptional()
  @IsString()
  @MinLength(7)
  @MaxLength(7)
  numColor: string;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}
