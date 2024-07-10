import { IsString } from 'class-validator';

export class CreateSellTypeDto {
  @IsString()
  name: string;

  @IsString()
  code: string;
}