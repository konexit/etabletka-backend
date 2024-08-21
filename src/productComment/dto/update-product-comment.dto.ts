import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateProductComment {
  @IsNotEmpty()
  productId: number;

  @IsNotEmpty()
  userId: number;

  @IsOptional()
  parentId: number;

  @IsString()
  comment: string;

  @IsOptional()
  isApproved: boolean;
}
