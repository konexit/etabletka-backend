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
  title: JSON;

  @Column({ unique: true })
  slug: string;

  @Column({ name: 'seo_h1', type: 'jsonb', nullable: true })
  seoH1: JSON;

  @Column({ name: 'seo_title', type: 'jsonb', nullable: true })
  seoTitle: JSON;

  @Column({ name: 'seo_description', type: 'jsonb', nullable: true })
  seoDescription: JSON;

  @Column({ name: 'seo_text', type: 'jsonb', nullable: true })
  seoText: JSON;

  @Column({ name: 'articles', type: 'int', array: true, default: {} })
  articles: number[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
