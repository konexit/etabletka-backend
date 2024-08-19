import { IsOptional, IsString } from 'class-validator';

export class CreatePostComment {
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
