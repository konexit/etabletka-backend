import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserRole } from './user-role.entity';
import { UserProfile } from './user-profile.entity';
import { BlogComment } from 'src/ui/pages/blogs/comment/entities/blog-comment.entity';
import { ProductComment } from "src/products/comment/entities/product-comment.entity";
import { USER_ROLE_USER } from '../user.constants';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  login: string;

  @Exclude()
  @Column({ length: 250 })
  password: string;

  @Column({ name: 'is_active', default: false })
  isActive: boolean;

  @Exclude()
  @Column({ name: 'code', nullable: true, length: 10 })
  code: string;

  @Column({ name: 'role_id', default: USER_ROLE_USER })
  roleId: number;

  @Column({ name: 'profile_id', nullable: true })
  profileId: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => UserRole, (role) => role.users)
  @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
  role: UserRole;

  @OneToOne(() => UserProfile, { cascade: true })
  @JoinColumn({ name: 'profile_id', referencedColumnName: 'id' })
  profile: UserProfile;

  @OneToMany(() => BlogComment, (blogComment) => blogComment.author)
  blogComments: BlogComment[];

  @OneToMany(() => ProductComment, (productComment) => productComment.author)
  productComments: ProductComment[];
}
