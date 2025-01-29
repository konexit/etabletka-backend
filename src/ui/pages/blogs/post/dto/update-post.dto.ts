import { IsOptional, IsString } from 'class-validator';

export class UpdatePost {
  @IsOptional()
  authorId: number;

  @IsOptional()
  censorId: number;

  @IsOptional()
  @IsString()
  publishedAt: Date;

  @IsOptional()
  @IsString()
  title: JSON;

  @IsOptional()
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
  categories: [];
}
