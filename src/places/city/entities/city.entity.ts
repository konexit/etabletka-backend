import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'cities',
})
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  lat: string;

  @Column({ nullable: true })
  lng: string;

  @Column({ name: 'country_id' })
  countryId: number;

  @Column({ name: 'region_id' })
  regionId: number;

  @Column({ name: 'district_id' })
  districtId: number;

  @Column({ name: 'community_id' })
  communityId: number;

  @Column({ name: 'prefix', type: 'json' })
  prefix: JSON;

  @Column({ name: 'name', type: 'json' })
  name: JSON;

  @Column({ unique: true })
  slug: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}

export default City;
