import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator';
import { CommentType } from '../entities/comment.entity';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsNumber()
  modelId: number;

  @IsEnum(CommentType)
  type: CommentType;

  @IsOptional()
  @IsNumber()
  parentId?: number;

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsNotEmpty()
  @IsString()
  comment: string;

  @IsOptional()
  @IsBoolean()
  anonymous?: boolean;
}
