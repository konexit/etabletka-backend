import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateProductGroup {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsBoolean()
  root: boolean;

  @IsOptional()
  @IsNumber()
  parentId: number;

  @IsOptional()
  products: [];
}
