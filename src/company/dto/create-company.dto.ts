import { IsString } from 'class-validator';

export class CreateCompany {
  @IsString()
  name: string;
}
