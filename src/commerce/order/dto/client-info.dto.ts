import { IsString, IsNumber, IsNotEmpty, IsMobilePhone, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UserOrderDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  address: string;

  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @IsString()
  sur_name: string;

  @IsString()
  last_name: string;

  @IsMobilePhone()
  @IsNotEmpty()
  mobile_phone: string;
}

export class ClientInfoDto {
  @ValidateNested()
  @Type(() => UserOrderDto)
  customer: UserOrderDto;

  @ValidateNested()
  @Type(() => UserOrderDto)
  recipient: UserOrderDto;

  @IsString()
  recipient_order: string;
}
