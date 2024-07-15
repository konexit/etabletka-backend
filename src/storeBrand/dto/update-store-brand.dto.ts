import { IsString } from 'class-validator';

export class UpdateStoreBrand {
  @IsString()
  name: string;
}
