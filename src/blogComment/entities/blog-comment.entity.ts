import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BlogPost } from '../../blogPost/entities/blog-post.entity';
import { User } from '../../user/entities/user.entity';

@Entity('blog_comments')
export class BlogComment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'post_id' })
  postId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'parent_id', nullable: true })
  parentId: number;

  @Column({ type: 'text' })
  comment: string;

  @Column({ name: 'is_approved', default: false })
  isApproved: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  author: User;

  @ManyToOne(() => BlogPost, (blogPost) => blogPost.blogComments)
  @JoinColumn({ name: 'post_id', referencedColumnName: 'id' })
  blogPost: BlogPost;
}
