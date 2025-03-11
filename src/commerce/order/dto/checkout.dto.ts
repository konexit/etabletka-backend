import { IsNumber, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ClientInfoDto } from './client-info.dto';

export class CheckoutDto {
  @IsNumber()
  cartId: number;

  @IsObject()
  @ValidateNested()
  @Type(() => ClientInfoDto)
  clientInfo: ClientInfoDto;
}