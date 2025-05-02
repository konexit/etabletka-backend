import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsBoolean,
  IsOptional,
  IsArray,
  IsEnum,
  ValidateNested,
  ArrayMinSize
} from 'class-validator';
import { LangContentDto } from 'src/common/dto/lang.dto';
import { ProductAttributes } from '../entities/product-attributes.entity';
import { 
  SearchFilterUIType,
  SearchIndexDataSource,
  SearchUISection,
  SearchUploadDataSource 
} from 'src/common/types/search/search.enum';

export class CreateProductAttributesDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @ValidateNested()
  @Type(() => LangContentDto)
  name: LangContentDto;

  @IsEnum(SearchUploadDataSource)
  type: SearchUploadDataSource;

  @IsEnum(SearchFilterUIType)
  typeUI: SearchFilterUIType;

  @IsEnum(SearchIndexDataSource)
  typeSource: SearchIndexDataSource;

  @IsNumber()
  order: number;

  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(SearchUISection, { each: true })
  sectionViews: SearchUISection[];

  @IsOptional()
  @IsArray()
  values: JSON;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  mergeKeys: ProductAttributes['key'][];

  @IsBoolean()
  searchEngine: boolean;

  @IsBoolean()
  ui: boolean;

  @IsBoolean()
  multipleValues: boolean;
}
