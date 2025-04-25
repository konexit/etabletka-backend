import { LangContent } from 'src/common/types/common/general';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'tags',
})
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'title', type: 'jsonb' })
  title: LangContent;

  @Column({ unique: true })
  slug: string;

  @Column({ name: 'seo_h1', type: 'jsonb', nullable: true })
  seoH1: LangContent;

  @Column({ name: 'seo_title', type: 'jsonb', nullable: true })
  seoTitle: LangContent;

  @Column({ name: 'seo_description', type: 'jsonb', nullable: true })
  seoDescription: LangContent;

  @Column({ name: 'seo_keywords', type: 'jsonb', nullable: true })
  seoKeywords: LangContent;

  @Column({ name: 'seo_text', type: 'jsonb', nullable: true })
  seoText: LangContent;

  @Column({ name: 'articles', type: 'int', array: true, default: {} })
  articles: number[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
