import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateDiscount {
  @IsString()
  name: JSON;

  @IsString()
  @IsOptional()
  slug: string;

  @IsNumber()
  type: number;

  @IsNumber()
  value: number;

  @IsString()
  @IsOptional()
  isActive: boolean;

  @IsDate()
  @IsOptional()
  publishStart: Date;

  @IsDate()
  @IsOptional()
  publishEnd: Date;
}
