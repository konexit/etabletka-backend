import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { Tag } from '../entities/tag.entity';

export class CreateArticle {
  @IsString()
  authorId: number;

  @IsString()
  censorId: number;

  @IsString()
  publishedAt: Date;

  @IsString()
  title: JSON;

  @IsString()
  content: JSON;

  @IsString()
  @IsOptional()
  excerpt: JSON;

  @IsString()
  @IsOptional()
  alt: JSON;

  @IsOptional()
  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  seoH1: JSON;

  @IsOptional()
  @IsString()
  seoTitle: JSON;

  @IsOptional()
  @IsString()
  seoDescription: JSON;

  @IsOptional()
  @IsString()
  image: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  tags: Tag['id'][];
}
