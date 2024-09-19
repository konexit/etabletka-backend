import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsBoolean,
  IsOptional,
  IsArray,
  IsObject
} from 'class-validator';
import { SectionViews, Type, TypeUI } from '../product-attributes.enum';

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

  @IsNumber()
  order: number;

  @IsBoolean()
  filter: boolean;

  @IsBoolean()
  filterUI: boolean;

  @IsArray()
  sectionViews: SectionViews[];

  @IsArray()
  values: JSON;

  @IsOptional()
  createdAt: Date;

  @IsOptional()
  updatedAt: Date;
}
