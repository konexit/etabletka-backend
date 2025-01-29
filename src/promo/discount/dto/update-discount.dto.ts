import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateDiscount {
  @IsOptional()
  @IsString()
  name: JSON;

  @IsString()
  @IsOptional()
  slug: string;

  @IsNumber()
  @IsOptional()
  type: number;

  @IsNumber()
  @IsOptional()
  value: number;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @IsString()
  @IsOptional()
  publishStart: Date;

  @IsString()
  @IsOptional()
  publishEnd: Date;

  @IsOptional()
  discountGroups: [];

  @IsOptional()
  products: [];
}
