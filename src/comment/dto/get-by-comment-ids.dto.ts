import { ArrayMinSize, IsArray, IsNumber } from 'class-validator';
import { Comment } from '../entities/comment.entity';

export class GetByCommentIdsDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  ids: Comment['id'][];
}
