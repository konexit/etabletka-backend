import { IsOptional, IsString } from 'class-validator';

export class CreateBlogCategory {
  @IsString()
  title: JSON;

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

}
