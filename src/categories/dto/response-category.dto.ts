import { Exclude, Expose, Type } from 'class-transformer';
import { Category } from '../entities/category.entity';

@Exclude()
export class ResponseCategoryDto {
  constructor(partial: Partial<Category>, langKey: string) {
    partial.name = partial.name?.[langKey] || null;
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
