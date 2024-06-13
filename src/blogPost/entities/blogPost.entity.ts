import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BlogCategory } from '../../blogCategoty/entities/blogCategory.entity';
import { BlogComment } from '../../blogComment/entities/blogComment.entity';

@Entity({
  name: 'blog_posts',
})
export class BlogPost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'author_id' })
  authorId: number;

  @Column({ name: 'censor_id' })
  censorId: number;

  @Column({ name: 'published_at', type: 'timestamp' })
  publishedAt: Date;

  @Column({ name: 'title', type: 'json' })
  title: JSON;

  @Column({ unique: true })
  slug: string;

  @Column({ name: 'excerpt', type: 'json', nullable: true })
  excerpt: JSON;

  @Column({ name: 'content', type: 'json', nullable: true })
  content: JSON;

  @Column({ name: 'alt', type: 'json', nullable: true })
  alt: JSON;

  @Column({ name: 'cdn_data', type: 'json', nullable: true })
  cdnData: JSON;

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

  @Column({ name: 'published', default: false })
  isPublished: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => BlogComment, (blogComment) => blogComment.blogPost)
  @JoinColumn({ name: 'id', referencedColumnName: 'post_id' })
  blogComments: BlogComment[];

  @ManyToMany(() => BlogCategory, (blogCategory) => blogCategory.posts)
  @JoinTable({
    name: 'blog_posts_categories',
    joinColumn: { name: 'post_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: BlogCategory[];
}
