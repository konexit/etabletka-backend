import {
  IsNotEmpty,
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
  @IsString()
  parentId: number;

  @IsOptional()
  @IsString()
  products: [];
}
