import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { Tag } from '../entities/tag.entity';
import { Article } from '../entities/article.entity';

export class UpdateTagDto {
  @IsOptional()
  @IsString()
  title: Tag['title'];

  @IsOptional()
  @IsString()
  seoH1: Tag['seoH1'];

  @IsOptional()
  @IsString()
  seoTitle: Tag['seoTitle'];

  @IsOptional()
  @IsString()
  seoDescription: Tag['seoDescription'];

  @IsOptional()
  @IsString()
  seoKeywords: Tag['seoKeywords'];

  @IsOptional()
  @IsString()
  seoText: Tag['seoText'];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  articles: Article['id'][];
}
