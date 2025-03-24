import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Katottg } from 'src/katottg/entities/katottg.entity';
import { ProductRemnant } from 'src/products/remnants/entities/product-remnant.entity';
import { StoreBrand } from 'src/stores/brand/entities/store-brand.entity';
import { SellType } from 'src/stores/sell-type/entities/sell-type.entity';

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

  @Column({ name: 'work_schedule', nullable: true })
  workSchedule: string;

  @Column({ nullable: true })
  contacts: string;

  @Column({ nullable: true })
  address: string;

  @Column({ name: 'active', default: false })
  isActive: boolean;

  @Column({ name: 'online', default: false })
  isOnline: boolean;

  @Column({ name: 'is_closed', default: false })
  isClosed: boolean;

  @Column({ name: 'is_whs_order', default: false })
  isWHSOrder: boolean;

  @Column({ name: 'sell_type_id', default: 1 })
  sellTypeId: number;

  @Column({ name: 'store_brand_id', default: 1 })
  storeBrandId: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => ProductRemnant, (productRemnant) => productRemnant.store)
  productRemnants: ProductRemnant[];

  @ManyToOne(() => Katottg, (katottg: Katottg) => katottg.stores)
  @JoinColumn({ name: 'katottg_id' })
  katottg: Katottg;

  @ManyToOne(() => StoreBrand, (storeBrand: StoreBrand) => storeBrand.stores)
  @JoinColumn({ name: 'store_brand_id' })
  storeBrand: StoreBrand;

  @ManyToOne(() => SellType, (sellType: SellType) => sellType.stores)
  @JoinColumn({ name: 'sell_type_id' })
  sellType: SellType;
}
