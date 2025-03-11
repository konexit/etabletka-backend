import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class UserOrderDto {
  name: string;
  address: string;
  user_id: number;
  sur_name: string;
  last_name: string;
  mobile_phone: string;
}

export class ClientInfoDto {
  @ValidateNested()
  @Type(() => UserOrderDto)
  customer: UserOrderDto;

  @ValidateNested()
  @Type(() => UserOrderDto)
  recipient: UserOrderDto;

  recipient_order: string;
}
