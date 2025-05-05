import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { LangContent } from 'src/common/types/common/general.interface';
import { Tag } from './tag.entity';

@Entity({
  name: 'articles',
})
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'author_id' })
  authorId: number;

  @Column({ name: 'censor_id' })
  censorId: number;

  @Column({ name: 'published_at', type: 'date' })
  publishedAt: Date;

  @Column({ name: 'title', type: 'jsonb' })
  title: LangContent;

  @Column({ unique: true })
  slug: string;

  @Column({ name: 'excerpt', type: 'jsonb', nullable: true })
  excerpt: LangContent;

  @Column({ name: 'content', type: 'jsonb', nullable: true })
  content: LangContent;

  @Column({ name: 'alt', type: 'jsonb', nullable: true })
  alt: LangContent;

  @Column({ name: 'seo_h1', type: 'jsonb', nullable: true })
  seoH1: LangContent;

  @Column({ name: 'seo_title', type: 'jsonb', nullable: true })
  seoTitle: LangContent;

  @Column({ name: 'seo_description', type: 'jsonb', nullable: true })
  seoDescription: LangContent;

  @Column({ name: 'seo_keywords', type: 'jsonb', nullable: true })
  seoKeywords: LangContent;

  @Column({ name: 'published', default: false })
  isPublished: boolean;

  @Column({ name: 'image', nullable: true })
  image: string;

  @Column({ name: 'comments_count', default: 0 })
  commentsCount: number;

  @Column({ name: 'tags', type: 'int', array: true, default: {} })
  tags: Tag['id'][];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'author_id', referencedColumnName: 'id' })
  author: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'censor_id', referencedColumnName: 'id' })
  censor: User;
}
