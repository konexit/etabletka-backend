import { IsString } from 'class-validator';

export class UpdateCompany {
  @IsString()
  name: string;
}
