import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdatePostComment {
  @IsNotEmpty()
  postId: number;

  @IsNotEmpty()
  userId: number;

  @IsOptional()
  parentId: number;

  @IsString()
  comment: string;

  @IsOptional()
  isApproved: boolean;
}
