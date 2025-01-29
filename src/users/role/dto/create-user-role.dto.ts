import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRole {
  @IsString()
  @IsNotEmpty()
  role: string;
}
