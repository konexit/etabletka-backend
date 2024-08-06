import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductGroup {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  slug: string;

  @IsOptional()
  @IsString()
  root: boolean;

  @IsOptional()
  @IsNumber()
  parentId: number;
}
