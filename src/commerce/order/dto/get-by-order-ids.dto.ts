import { IsArray, IsNumber } from 'class-validator';
import { Order } from '../entities/order.entity';

export class GetByOrderIdsDto {
  @IsNumber({}, { each: true })
  @IsArray()
  ids: Order['id'][];
}
