import { IsString } from 'class-validator';

export class UpdateSellTypeDto {
  @IsString()
  name: string;

  @IsString()
  code: string;
}
