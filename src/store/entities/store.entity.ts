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
import { Company } from 'src/company/entities/company.entity';

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

  @Column({ name: 'katottg_id', nullable: true })
  katottgId: number;

  @Column({ nullable: true })
  lat: string;

  @Column({ nullable: true })
  lng: string;

  @Column({ type: 'jsonb' })
  name: JSON;

  @Column({ unique: true })
  slug: string;

  @Column({ name: 'cdn_data', type: 'jsonb', nullable: true })
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

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Katottg, (katottg: Katottg) => katottg.stores)
  @JoinColumn({ name: 'katottg_id' })
  katottg: Katottg;

  @ManyToOne(() => Company, (company: Company) => company.stores)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @OneToMany(() => ProductRemnant, (productRemnant) => productRemnant.store)
  productRemnants: ProductRemnant[];
}
