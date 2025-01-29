import { IsString } from 'class-validator';

export class CreateStoreBrand {
  @IsString()
  name: string;
}
