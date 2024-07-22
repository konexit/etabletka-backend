import { IsOptional, IsString } from "class-validator";

export class UpdateDiscount {
  @IsOptional()
  @IsString()
  name: JSON;

  @IsOptional()
  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  type: number;

  @IsOptional()
  @IsString()
  value: number;

  @IsOptional()
  @IsString()
  isActive: boolean;

  @IsOptional()
  @IsString()
  publishStart: Date;

  @IsOptional()
  @IsString()
  publishEnd: Date;
}