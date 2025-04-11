import { ArrayMinSize, IsArray, IsNumber } from 'class-validator';
import { User } from '../entities/user.entity';

export class GetByUserIdsDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  ids: User['id'][];
}
