import { Exclude, Expose, Type } from 'class-transformer';
import { Category } from '../entities/category.entity';

@Exclude()
export class ResponseCategoryDto {
  constructor(
    partial: Category & { children?: Category[] } & Record<string, any>,
    langKey: string,
  ) {
    partial.name = partial.name?.[langKey] || null;

    if (Array.isArray(partial.children)) {
      for (const children of partial.children) {
        children.name = children.name?.[langKey] || null;
      }
    }

    return Object.assign(this, partial);
  }

  parentId: number;
  depth: number;

  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  path: string;

  @Expose()
  cdnIcon: string;

  @Expose()
  cdnData: JSON;

  @Expose()
  alt: JSON;

  @Expose()
  root: boolean;

  @Expose()
  @Type(() => ResponseCategoryDto)
  children: ResponseCategoryDto[];
}
