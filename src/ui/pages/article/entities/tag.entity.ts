import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Article } from './article.entity';

@Entity({
  name: 'tag',
})
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'title', type: 'jsonb' })
  title: JSON;

  @Column({ unique: true })
  slug: string;

  @Column({ name: 'seo_h1', type: 'jsonb', nullable: true })
  seoH1: JSON;

  @Column({ name: 'seo_title', type: 'jsonb', nullable: true })
  seoTitle: JSON;

  @Column({ name: 'seo_description', type: 'jsonb', nullable: true })
  seoDescription: JSON;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToMany(() => Article)
  @JoinTable({
    name: 'articles_tags',
  })
  articles: Article[];
}
