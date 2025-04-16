import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Comment } from './comment.entity';

@Entity('comment_answers')
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'comment_id' })
  commentId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ type: 'text' })
  answer: string;

  @Column({ name: 'approved', default: false })
  approved: boolean;

  @Column({ name: 'anonymous', default: false })
  anonymous: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
  deletedAt: Date;

  @ManyToOne(
    () => Comment,
    (comment) => comment.id,
    {
      createForeignKeyConstraints: false,
    },
  )
  @JoinColumn({ name: 'comment_id' })
  comment: Comment;
}
