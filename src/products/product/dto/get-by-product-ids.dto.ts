import { ArrayMinSize, IsArray, IsNumber } from 'class-validator';
import { Product } from '../entities/product.entity';

export class GetByProductIdsDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  ids: Product['id'][];
}
