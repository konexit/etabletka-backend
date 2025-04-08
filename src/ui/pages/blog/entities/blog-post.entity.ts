import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { BlogComment } from './blog-comment.entity';
import { BlogCategory } from './blog-category.entity';

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

  @Column({ name: 'published_at', type: 'date' })
  publishedAt: Date;

  @Column({ name: 'title', type: 'jsonb' })
  title: JSON;

  @Column({ unique: true })
  slug: string;

  @Column({ name: 'excerpt', type: 'jsonb', nullable: true })
  excerpt: JSON;

  @Column({ name: 'content', type: 'jsonb', nullable: true })
  content: JSON;

  @Column({ name: 'alt', type: 'jsonb', nullable: true })
  alt: JSON;

  @Column({ name: 'cdn_data', type: 'jsonb', nullable: true })
  cdnData: JSON;

  @Column({ name: 'seo_h1', type: 'jsonb', nullable: true })
  seoH1: JSON;

  @Column({ name: 'seo_title', type: 'jsonb', nullable: true })
  seoTitle: JSON;

  @Column({ name: 'seo_description', type: 'jsonb', nullable: true })
  seoDescription: JSON;

  @Column({ name: 'published', default: false })
  isPublished: boolean;

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

  @OneToMany(() => BlogComment, (blogComment) => blogComment.blogPost)
  blogComments: BlogComment[];

  @ManyToMany(() => BlogCategory)
  @JoinTable({ name: 'blog_posts_blog_categories' })
  blogCategories: BlogCategory[];
}
