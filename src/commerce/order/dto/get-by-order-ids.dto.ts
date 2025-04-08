import { IsArray, IsNumber, ArrayMinSize } from 'class-validator';
import { Order } from '../entities/order.entity';

export class GetByOrderIdsDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  ids: Order['id'][];
}
