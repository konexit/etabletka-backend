import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({
  name: 'user_profile',
})
export class UserProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name', nullable: true, length: 50 })
  firstName: string;

  @Column({ name: 'last_name', nullable: true, length: 50 })
  lastName: string;

  @Column({ name: 'middle_name', nullable: true, length: 50 })
  middleName: string;

  @Column({ length: 15, nullable: true, })
  phone: string;

  @Column({ length: 50, nullable: true })
  email: string;

  @Column({ name: 'date_of_birth', type: 'timestamp', nullable: true })
  dateOfBirth: Date;

  @Column({ name: 'katottg_id', nullable: true })
  katottgId: number;

  @Column({ name: 'street_prefix', default: 'вул.', length: 20, nullable: true })
  streetPrefix: string;

  @Column({ name: 'street', nullable: true, length: 200 })
  street: string;

  @Column({ name: 'house', nullable: true, length: 10 })
  house: string;

  @Column({ name: 'apartment', nullable: true, length: 10 })
  apartment: string;

  @Column({ name: 'floor', nullable: true, length: 10 })
  floor: string;

  @Column({ name: 'avatar', nullable: true })
  avatar: string;

  @Column({ name: 'favorite_products', type: 'int', array: true, default: () => `'{}'::integer[]` })
  favoriteProducts: number[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
