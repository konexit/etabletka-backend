import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Store } from '../../../store/entities/store.entity';

@Entity({
  name: 'districts',
})
export class District {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'country_id' })
  countryId: number;

  @Column({ name: 'region_id' })
  regionId: number;

  @Column({ name: 'name', type: 'json' })
  name: JSON;

  @Column({ unique: true })
  slug: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Store, (store) => store.district)
  stores: Store[];
}
