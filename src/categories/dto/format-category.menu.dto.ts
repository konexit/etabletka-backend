import { Exclude } from 'class-transformer';
export class FormatCategoryMenuDto {
  @Exclude()
  depth: number;

  id: number;
  name: string;
  path: string;
  cdnIcon: string;
  cdnData: JSON;
  alt: JSON;
  root: boolean;
  lft: number;
  rgt: number;
  children: FormatCategoryMenuDto[];
}
