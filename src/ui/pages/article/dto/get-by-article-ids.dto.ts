import { ArrayMinSize, IsArray, IsNumber } from 'class-validator';
import { Article } from '../entities/article.entity';

export class GetByArticleIdsDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  ids: Article['id'][];
}
