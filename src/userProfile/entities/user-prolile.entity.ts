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

  @Column({ name: 'country_id', default: 1 })
  countryId: number;

  @Column({ name: 'region_id', nullable: true })
  regionId: number;

  @Column({ name: 'district_id', nullable: true })
  districtId: number;

  @Column({ name: 'city_id', nullable: true })
  cityId: number;

  @Column({ name: 'street_prefix', default: 'вул.', length: 20 })
  streetPrefix: string;

  @Column({ name: 'street', nullable: true, length: 200 })
  street: string;

  @Column({ name: 'house', nullable: true, length: 10 })
  house: string;

  @Column({ name: 'apartment', nullable: true, length: 10 })
  apartment: string;

  @Column({ name: 'avatar', type: 'json', nullable: true })
  avatar: JSON;

  @Column({ name: 'favorite_products', type: 'json', nullable: true })
  favoriteProducts: JSON;

  @Column({ name: 'favorite_stores', type: 'json', nullable: true })
  favoriteStores: JSON;
}
