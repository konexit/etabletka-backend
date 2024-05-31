import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Store } from '../../../store/entities/store.entity';

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

  @Column({ name: 'country_id', nullable: true })
  countryId: number;

  @Column({ name: 'region_id', nullable: true })
  regionId: number;

  @Column({ name: 'district_id', nullable: true })
  districtId: number;

  @Column({ name: 'community_id', nullable: true })
  communityId: number;

  @Column({ name: 'prefix', type: 'json', nullable: true })
  prefix: JSON;

  @Column({ name: 'name', type: 'json' })
  name: JSON;

  @Column({ unique: true })
  slug: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @Exclude()
  storesCount: number;

  @OneToMany(() => Store, store => store.city)
  stores: Store[];
}
