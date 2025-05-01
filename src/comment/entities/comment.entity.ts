import { Product } from 'src/products/product/entities/product.entity';
import { Article } from 'src/ui/pages/article/entities/article.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export type ModelId = Product['id'] | Article['id'];

export enum CommentType {
  Article = 'article',
  Product = 'product',
}

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'model_id' })
  modelId: ModelId;

  @Column({
    type: 'enum',
    enum: CommentType,
  })
  type: CommentType;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'rating', nullable: true })
  rating: number;

  @Column({ type: 'text' })
  comment: string;

  @Column({ name: 'approved', default: false })
  approved: boolean;

  @Column({ name: 'anonymous', default: false })
  anonymous: boolean;

  @Column({ name: 'likes', type: 'int', array: true, default: '{}' })
  likes: number[];

  @Column({ name: 'dislikes', type: 'int', array: true, default: '{}' })
  dislikes: number[];

  @Column({ name: 'answers', type: 'int', array: true, default: '{}' })
  answers: number[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
  deletedAt: Date;
}
