import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateStoreDto {
  @IsOptional()
  @IsString()
  name: JSON;

  @IsOptional()
  @IsString()
  @MinLength(2)
  lat: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  lng: string;

  @IsOptional()
  @IsString()
  @MinLength(4)
  workTime: string;

  @IsOptional()
  @IsString()
  @MinLength(4)
  contacts: string;

  @IsOptional()
  @IsString()
  @MinLength(4)
  address: string;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @IsNumber()
  katottgId: number;

  @IsOptional()
  @IsNumber()
  companyId: number;
}
