import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { City } from '../../places/city/entities/city.entity';
import { District } from '../../places/district/entities/district.entity';
import { Region } from '../../places/region/entities/region.entity';

@Entity({
  name: 'stores',
})
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'sync_id', unique: true })
  syncId: number;

  @Column({ name: 'company_id', nullable: true })
  companyId: number;

  @Column({ name: 'country_id', default: 1 })
  countryId: number;

  @Column({ name: 'region_id', nullable: true })
  regionId: number;

  @Column({ name: 'district_id', nullable: true })
  districtId: number;

  @Column({ name: 'city_id', nullable: true })
  cityId: number;

  @Column({ nullable: true })
  lat: string;

  @Column({ nullable: true })
  lng: string;

  @Column({ type: 'json' })
  name: JSON;

  @Column({ unique: true })
  slug: string;

  @Column({ name: 'cdn_data', type: 'json', nullable: true })
  cdnData: JSON;

  @Column({ name: 'work_time', nullable: true, length: 125 })
  workTime: string;

  @Column({ nullable: true, length: 125 })
  contacts: string;

  @Column({ nullable: true, length: 125 })
  address: string;

  @Column({ name: 'active', default: false })
  isActive: boolean;

  @Column({ name: 'sell_type', nullable: true, length: 125 })
  sellType: string;

  @Column({ name: 'store_brand_id', default: 1 })
  storeBrandId: number;

  @ManyToOne(() => City, (city: City) => city.stores)
  @JoinColumn({ name: 'city_id' })
  city: City;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}