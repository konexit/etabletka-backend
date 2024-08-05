import {
  IsBoolean,
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
  @IsBoolean()
  root: boolean;

  @IsOptional()
  @IsNumber()
  parentId: number;
}
