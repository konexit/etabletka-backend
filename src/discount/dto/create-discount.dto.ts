import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

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

  // @IsOptional()
  // products: [];
}
