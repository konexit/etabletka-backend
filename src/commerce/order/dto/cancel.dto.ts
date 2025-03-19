import { IsNumber, IsString } from 'class-validator';

export class CancelDto {
  @IsNumber()
  orderId: number;

  @IsString()
  reason: string;
}