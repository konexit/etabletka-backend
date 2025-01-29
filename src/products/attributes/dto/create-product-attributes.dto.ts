import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsBoolean,
  IsOptional,
  IsArray,
  IsObject
} from 'class-validator';
import { SectionViews, Type, TypeSource, TypeUI } from '../product-attributes.enum';

export class CreateProductAttributes {
  @IsOptional()
  id: number

  @IsString()
  @IsNotEmpty()
  key: string;

  @IsObject()
  name: JSON;

  @IsNotEmpty()
  type: Type;

  @IsNotEmpty()
  typeUI: TypeUI;

  @IsNotEmpty()
  typeSource: TypeSource

  @IsNumber()
  order: number;

  @IsBoolean()
  searchEngine: boolean;

  @IsBoolean()
  ui: boolean;

  @IsBoolean()
  multipleValues: boolean;

  @IsArray()
  sectionViews: SectionViews[];

  @IsArray()
  values: JSON;

  @IsArray()
  mergeKeys: string[];

  @IsOptional()
  createdAt: Date;

  @IsOptional()
  updatedAt: Date;
}
