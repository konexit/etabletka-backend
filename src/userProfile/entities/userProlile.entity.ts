import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'user_profile',
})
export class UserProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', unique: true })
  userId: number;

  @Column({ name: 'date_of_birth', length: 30, nullable: true })
  dateOfBirth: string;

  @Column({ name: 'avatar', type: 'json', nullable: true })
  avatar: JSON;

  @Column({ name: 'favorite_products', type: 'json', nullable: true })
  favoriteProducts: JSON;

  @Column({ name: 'favorite_stores', type: 'json', nullable: true })
  favoriteStores: JSON;
}
