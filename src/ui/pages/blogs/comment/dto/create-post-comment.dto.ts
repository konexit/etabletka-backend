import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostComment {
  @IsNotEmpty()
  postId: number;

  @IsNotEmpty()
  userId: number;

  @IsOptional()
  parentId: number;

  @IsString()
  comment: string;
}
