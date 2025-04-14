import { Exclude, Expose, Type } from 'class-transformer';
import { CategoryNode } from '../categories.module';
import { Category } from '../entities/category.entity';

@Exclude()
export class ResponseCategoryDto {
  constructor(
    partial: CategoryNode | Category,
    langKey = 'uk',
  ) {
    const categoryObject = JSON.parse(JSON.stringify(partial));

    this.assignLocalizedName(categoryObject, langKey);

    Object.assign(this, categoryObject);
  }

  private assignLocalizedName(
    node: CategoryNode | Category,
    langKey: string,
  ) {
    node.name = node.name?.[langKey] || null;

    if ('children' in node && Array.isArray(node.children)) {
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
  icon: string;

  @Expose()
  image: string;

  @Expose()
  root: boolean;

  @Expose()
  @Type(() => ResponseCategoryDto)
  children: ResponseCategoryDto[];
}
