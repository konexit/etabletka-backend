import { IsOptional, IsNumber } from 'class-validator';
import { SectionViews, Type, TypeUI } from '../product-attributes.enum';

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
  order: number;

  @IsOptional()
  filter: boolean;

  @IsOptional()
  filterUI: boolean;

  @IsOptional()
  sectionViews: SectionViews[];

  @IsOptional()
  values: JSON;
}
