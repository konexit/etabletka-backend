import { IsOptional, IsNumber } from 'class-validator';
import { SectionViews, Type, TypeSource, TypeUI } from '../product-attributes.enum';

export class UpdateProductAttributes {
  @IsOptional()
  key: string;

  @IsOptional()
  name: JSON;

  @IsOptional()
  type: Type;

  @IsOptional()
  typeUI: TypeUI;

  @IsOptional()
  typeSource: TypeSource;

  @IsOptional()
  order: number;

  @IsOptional()
  searchEngine: boolean;

  @IsOptional()
  ui: boolean;

  @IsOptional()
  sectionViews: SectionViews[];

  @IsOptional()
  values: JSON;
}
