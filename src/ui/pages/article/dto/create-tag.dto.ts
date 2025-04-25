import { IsArray, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Tag } from '../entities/tag.entity';
import { Article } from '../entities/article.entity';
import { Type } from 'class-transformer';
import { LangContentDto } from 'src/common/dto/lang.dto';

export class CreateTagDto {
  @ValidateNested()
  @Type(() => LangContentDto)
  title: Tag['title'];

  @IsOptional()
  @ValidateNested()
  @Type(() => LangContentDto)
  seoH1: Tag['seoH1'];

  @IsOptional()
  @ValidateNested()
  @Type(() => LangContentDto)
  seoTitle: Tag['seoTitle'];

  @IsOptional()
  @ValidateNested()
  @Type(() => LangContentDto)
  seoDescription: Tag['seoDescription'];

  @IsOptional()
  @ValidateNested()
  @Type(() => LangContentDto)
  seoText: Tag['seoText'];

  @IsOptional()
  @ValidateNested()
  @Type(() => LangContentDto)
  seoKeywords: Tag['seoKeywords'];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  articles: Article['id'][];
}
