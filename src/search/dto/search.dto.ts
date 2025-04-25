import { IsArray, IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class SearchDto {
  @Length(0, 255)
  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  lang?: string;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsNumber()
  offset?: number;

  @IsOptional()
  @IsString()
  filter?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sort?: string[];
}
