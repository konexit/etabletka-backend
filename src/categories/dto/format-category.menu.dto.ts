import { Exclude } from 'class-transformer';
export class FormatCategoryMenuDto {
  @Exclude()
  depth: number;

  id: number;
  name: string;
  path: string;
  slug: string;
  cdnIcon: string;
  cdnData: JSON;
  alt: JSON;
  children: FormatCategoryMenuDto[];
  root: boolean;
}
