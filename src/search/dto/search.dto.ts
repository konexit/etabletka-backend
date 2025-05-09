import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  ValidateNested
} from 'class-validator';
import { SearchIndexType } from 'src/common/types/search/search.enum';
import { SearchFacetFilterDto } from './facet-search-filters.dto';

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
  categoryId?: number;

  @IsOptional()
  @IsString()
  productGroupSlug?: string;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsNumber()
  offset?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SearchFacetFilterDto)
  filters?: SearchFacetFilterDto[];

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
