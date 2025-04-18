import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export enum CommentType {
  ARTICLE = 'article',
  PRODUCT = 'product',
}

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'model_id' })
  modelId: number;

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
