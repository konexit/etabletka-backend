import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateDiscountGroup {
  @IsOptional()
  @IsString()
  name: JSON;

  @IsOptional()
  @IsString()
  slug: string;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}
