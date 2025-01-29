import { IsOptional, IsString } from 'class-validator';

export class CreateDiscountGroup {
  @IsString()
  name: JSON;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  isActive: boolean;
}
