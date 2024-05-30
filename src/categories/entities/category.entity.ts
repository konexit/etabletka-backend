import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
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

  @Column({ type: 'json', nullable: true })
  name: JSON;

  @Column({ name: 'name_short', type: 'json', nullable: true })
  @Exclude()
  nameShort: JSON;

  @Column({ nullable: true })
  path: string;

  @Column({ nullable: true })
  slug: string;

  @Column({ type: 'json', nullable: true })
  description: JSON;

  @Column({ name: 'seo_h1', type: 'json', nullable: true })
  seoH1: JSON;

  @Column({ name: 'seo_title', type: 'json', nullable: true })
  seoTitle: JSON;

  @Column({ name: 'seo_description', type: 'json', nullable: true })
  seoDescription: JSON;

  @Column({ name: 'seo_keywords', type: 'json', nullable: true })
  seoKeywords: JSON;

  @Column({ name: 'seo_text', type: 'json', nullable: true })
  seoText: JSON;

  @Column({ nullable: true })
  image: string;

  @Column({ name: 'cdn_icon', nullable: true })
  cdnIcon: string;

  @Column({ name: 'cdn_data', type: 'json', nullable: true })
  @Exclude()
  cdnData: JSON;

  @Column({ nullable: true })
  icon: string;

  @Column({ type: 'json', nullable: true })
  alt: JSON;

  @Column({ default: 0 })
  @Exclude()
  position: number;

  @Column({ default: false })
  @Exclude()
  root: boolean;

  @Column({ default: 0 })
  @Exclude()
  lft: number;

  @Column({ default: 0 })
  @Exclude()
  rgt: number;

  @Column({ default: true })
  @Exclude()
  active: boolean;

  @Column({ name: 'show_menu', default: true })
  @Exclude()
  showMenu: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  @Exclude()
  updatedAt: Date;
}
