import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Tag } from '../entities/tag.entity';
import { Article } from '../entities/article.entity';
import { User } from 'src/user/entities/user.entity';
import { Type } from 'class-transformer';
import { LangContentDto } from 'src/common/dto/lang.dto';

export class CreateArticleDto {
  @IsNumber()
  authorId: User['id'];

  @IsNumber()
  censorId: User['id'];

  @ValidateNested()
  @Type(() => LangContentDto)
  title: Article['title'];

  @IsOptional()
  @ValidateNested()
  @Type(() => LangContentDto)
  content: Article['content'];

  @IsOptional()
  @ValidateNested()
  @Type(() => LangContentDto)
  excerpt: Article['excerpt'];

  @IsOptional()
  @ValidateNested()
  @Type(() => LangContentDto)
  alt: Article['alt'];

  @IsOptional()
  @ValidateNested()
  @Type(() => LangContentDto)
  seoH1: Article['seoH1'];

  @IsOptional()
  @ValidateNested()
  @Type(() => LangContentDto)
  seoTitle: Article['seoTitle'];

  @IsOptional()
  @ValidateNested()
  @Type(() => LangContentDto)
  seoDescription: Article['seoDescription'];

  @IsOptional()
  @ValidateNested()
  @Type(() => LangContentDto)
  seoKeywords: Article['seoKeywords'];

  @IsOptional()
  @IsString()
  image: Article['image'];

  @IsOptional()
  @IsString()
  publishedAt: Article['publishedAt'];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  tags: Tag['id'][];
}
