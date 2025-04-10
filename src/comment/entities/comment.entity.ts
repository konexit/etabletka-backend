import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export enum ModelType {
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
    enum: ModelType,
  })
  type: ModelType;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'parent_id', nullable: true })
  parentId: number;

  @Column({ name: 'rating', nullable: true })
  rating: number;

  @Column({ type: 'text' })
  comment: string;

  @Column({ name: 'approved', default: false })
  approved: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
  deletedAt: Date;
}
