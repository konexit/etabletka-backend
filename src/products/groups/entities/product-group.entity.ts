import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LangContent } from 'src/common/types/common/general.interface';
import { Category } from 'src/categories/entities/category.entity';

@Entity({
  name: 'product_groups',
})
export class ProductGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'jsonb' })
  name: LangContent;

  @Column({ unique: true })
  slug: string;

  @Column({ default: false })
  root: boolean;

  @Column({ default: true })
  active: boolean;

  @Column({ name: 'parent_id', default: null })
  parentId: number;

  @Column({ name: 'breadcrumbs_category', type: 'integer', array: true, default: {} })
  breadcrumbsCategory: Category['id'][];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
