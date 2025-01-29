import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProductComment {
  @IsNotEmpty()
  productId: number;

  @IsNotEmpty()
  userId: number;

  @IsOptional()
  parentId: number;

  @IsString()
  comment: string;
}
