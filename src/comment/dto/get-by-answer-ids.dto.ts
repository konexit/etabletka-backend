import { ArrayMinSize, IsArray, IsNumber } from 'class-validator';
import { Answer } from '../entities/comment-answer.entity';

export class GetByAnswerIdsDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  ids: Answer['id'][];
}
