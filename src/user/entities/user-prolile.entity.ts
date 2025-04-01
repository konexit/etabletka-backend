import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ length: 15, nullable: true, })
  phone: string;

  @Column({ length: 50, nullable: true })
  email: string;

  @Column({ name: 'date_of_birth', length: 30, nullable: true })
  dateOfBirth: string;

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

  @Column({ name: 'avatar', type: 'jsonb', nullable: true })
  avatar: JSON;

  @Column({ name: 'favorite_products', type: 'int', array: true, default: () => 'ARRAY[]::int[]' })
  favoriteProducts: number[];
}
