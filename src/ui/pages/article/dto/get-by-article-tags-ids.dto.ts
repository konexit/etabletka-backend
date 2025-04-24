import { ArrayMinSize, IsArray, IsNumber } from 'class-validator';
import { Tag } from '../entities/tag.entity';

export class GetByArticleTagsIdsDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  ids: Tag['id'][];
}
