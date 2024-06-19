import { Exclude } from 'class-transformer';
export class FormatCategoryMenuDto {
  @Exclude()
  depth: number;

  id: number;
  name: string;
  path: string;
  cdnIcon: string;
  alt: JSON;
  children: FormatCategoryMenuDto[];
  hasProducts: boolean;
}
