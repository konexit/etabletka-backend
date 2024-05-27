import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  phone: string;

  @Column( { nullable: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ name: 'first_name', length: 30 })
  firstName: string;

  @Column({ name: 'last_name', length: 30 })
  lastName: string;

  @Column({ name: 'date_of_birth', length: 30 })
  dateOfBirth: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'role_id', default: 1 })
  roleId: number;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}

export default User;
