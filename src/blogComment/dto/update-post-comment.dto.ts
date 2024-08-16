import { IsOptional, IsString } from 'class-validator';

export class UpdatePostComment {
  @IsString()
  id: number;

  @IsString()
  postId: number;

  @IsString()
  userId: number;

  @IsString()
  @IsOptional()
  parentId: number;

  @IsString()
  comment: string;
}
