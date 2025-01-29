import { IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';
export class CreateProductRemnant {
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @IsNumber()
  @IsNotEmpty()
  storeId: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}
