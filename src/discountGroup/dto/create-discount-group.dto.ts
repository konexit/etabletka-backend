import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateDiscountGroup {
  @IsString()
  name: JSON;

  @IsString()
  slug: string;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}
