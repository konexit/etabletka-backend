import { IsOptional, IsString } from 'class-validator';

export class UpdatePost {
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
  seoKeywords: JSON;

  @IsOptional()
  @IsString()
  seoText: JSON;
}
