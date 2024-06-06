import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from '../../role/entities/role.entity';

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

  @Exclude( )
  @Column({ length: 250 })
  password: string;

  @Column({ name: 'first_name', length: 30 })
  firstName: string;

  @Column({ name: 'last_name', length: 30 })
  lastName: string;

  @Column({ name: 'date_of_birth', length: 30, nullable: true })
  dateOfBirth: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'role_id', default: 2 })
  roleId: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
  role: Role;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
