import { IsOptional, IsString } from 'class-validator';

export class CreateDiscount {
  @IsString()
  name: JSON;

  @IsString()
  @IsOptional()
  slug: string;

  @IsString()
  type: number;

  @IsString()
  value: number;

  @IsString()
  @IsOptional()
  isActive: boolean;

  @IsString()
  @IsOptional()
  publishStart: Date;

  @IsString()
  @IsOptional()
  publishEnd: Date;

  @IsOptional()
  @IsString()
  discountGroups: [];

  @IsOptional()
  @IsString()
  products: [];
}
