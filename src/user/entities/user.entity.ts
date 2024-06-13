import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne, OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Exclude } from 'class-transformer';
import { Role } from '../../role/entities/role.entity';
import { UserProfile } from "../../userProfile/entities/userProlile.entity";

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 15 })
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

  @Column({ name: 'role_id', default: 2 })
  roleId: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
  role: Role;

  @OneToOne(() => UserProfile)
  @JoinColumn({ name: 'user_id' })
  userProfile: UserProfile;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
