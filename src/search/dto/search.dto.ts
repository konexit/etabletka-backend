import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { SearchIndexType } from 'src/common/types/search/search.enum';

export class SearchDto {
  @Length(0, 255)
  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  lang?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

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

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  retrieveAttibutes?: string[];

  @IsOptional()
  @IsEnum(SearchIndexType)
  searchIndex?: SearchIndexType;
}
