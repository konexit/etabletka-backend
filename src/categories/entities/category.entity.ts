import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Breadcrumbs, LangContent } from 'src/common/types/common/general.interface';
@Entity({
  name: 'categories',
})
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'sync_id', nullable: true, unique: true })
  @Exclude()
  syncId: number;

  @Column({ name: 'sync_parent_id', nullable: true })
  @Exclude()
  syncParentId: number;

  @Column({ name: 'parent_id', nullable: true, default: 0 })
  parentId: number;

  @Column({ name: 'product_count', default: 0 })
  productCount: number;

  @Column({ type: 'jsonb', nullable: true })
  name: LangContent;

  @Column({ name: 'name_short', type: 'jsonb', nullable: true })
  @Exclude()
  nameShort: LangContent;

  @Column({ type: 'integer', array: true, default: {} })
  path: Category['id'][];

  @Column({ nullable: true })
  slug: string;

  @Column({ type: 'jsonb', nullable: true })
  description: JSON;

  @Column({ name: 'seo_h1', type: 'jsonb', nullable: true })
  seoH1: JSON;

  @Column({ name: 'seo_title', type: 'jsonb', nullable: true })
  seoTitle: JSON;

  @Column({ name: 'seo_description', type: 'jsonb', nullable: true })
  seoDescription: JSON;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ default: 0 })
  @Exclude()
  position: number;

  @Column({ default: false })
  @Exclude()
  root: boolean;

  @Column({ default: 0 })
  lft: number;

  @Column({ default: 0 })
  rgt: number;

  @Column({ default: true })
  @Exclude()
  active: boolean;

  @Column({ name: 'show_menu', default: true })
  @Exclude()
  showMenu: boolean;

  @Column({ name: 'breadcrumbs', type: 'jsonb', nullable: true })
  breadcrumbs: Breadcrumbs;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  @Exclude()
  updatedAt: Date;
}
