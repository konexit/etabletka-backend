import { IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CartOrderDto implements Cart.Order {
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];
}

export class CartItemDto implements Cart.Item {
  @IsNumber()
  id: number;

  @IsNumber()
  quantity: number;
}
