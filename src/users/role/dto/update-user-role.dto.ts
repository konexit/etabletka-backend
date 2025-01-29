import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateRole {
  @IsString()
  @IsNotEmpty()
  role: string;
}
