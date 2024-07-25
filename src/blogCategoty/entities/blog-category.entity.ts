import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BlogPost } from '../../blogPost/entities/blog-post.entity';

@Entity({
  name: 'blog_categories',
})
export class BlogCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'title', type: 'json' })
  title: JSON;

  @Column({ unique: true })
  slug: string;

  @Column({ name: 'seo_h1', type: 'json', nullable: true })
  seoH1: JSON;

  @Column({ name: 'seo_title', type: 'json', nullable: true })
  seoTitle: JSON;

  @Column({ name: 'seo_description', type: 'json', nullable: true })
  seoDescription: JSON;

  @Column({ name: 'seo_text', type: 'json', nullable: true })
  seoText: JSON;

  @Column({ name: 'seo_keywords', type: 'json', nullable: true })
  seoKeywords: JSON;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToMany(() => BlogPost)
  @JoinTable({
    name: 'cross_blog_categories_posts',
  })
  posts: BlogPost[];
}
