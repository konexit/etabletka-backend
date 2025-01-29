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
import { UserRole } from 'src/users/role/entities/role.entity';
import { UserProfile } from 'src/users//profile/entities/user-prolile.entity';
import { BlogComment } from 'src/blogComment/entities/blog-comment.entity';
import { ProductComment } from "src/productComment/entities/product-comment.entity";
import { ROLE_USER } from 'src/users/role/user-role.constants';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  login: string;

  @Column({ length: 15 })
  phone: string;

  @Column({ nullable: true, length: 50 })
  email: string;

  @Exclude()
  @Column({ length: 250 })
  password: string;

  @Column({ name: 'first_name', nullable: true, length: 50 })
  firstName: string;

  @Column({ name: 'last_name', nullable: true, length: 50 })
  lastName: string;

  @Column({ name: 'is_active', default: false })
  isActive: boolean;

  @Exclude()
  @Column({ name: 'code', nullable: true, length: 10 })
  code: string;

  @Column({ name: 'role_id', default: ROLE_USER })
  roleId: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => UserRole, (role) => role.users)
  @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
  role: UserRole;

  @OneToOne(() => UserProfile)
  userProfile: UserProfile;

  @OneToMany(() => BlogComment, (blogComment) => blogComment.author)
  blogComments: BlogComment[];

  @OneToMany(() => ProductComment, (productComment) => productComment.author)
  productComments: ProductComment[];

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
