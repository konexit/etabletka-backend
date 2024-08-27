import { Exclude, Expose, Type } from 'class-transformer';
import { CategoryNode } from '../categories.module';
import { Category } from '../entities/category.entity';

@Exclude()
export class ResponseCategoryDto {
  constructor(
    partial: (CategoryNode | Category) & Record<string, any>,
    langKey: string = 'uk',
  ) {
    this.assignLocalizedName(partial, langKey);
    return Object.assign(this, partial);
  }

  private assignLocalizedName(
    node: (CategoryNode | Category) & Record<string, any>,
    langKey: string,
  ) {
    node.name = node.name?.[langKey] || null;

    if (Array.isArray(node.children)) {
      for (const child of node.children) {
        this.assignLocalizedName(child, langKey);
      }
    }
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
