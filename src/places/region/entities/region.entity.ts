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
  name: 'regions',
})
export class Region {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  lat: string;

  @Column({ nullable: true })
  lng: string;

  @Column({ name: 'country_id' })
  countryId: number;

  @Column({ name: 'name', type: 'json' })
  name: JSON;

  @Column({ name: 'short_name' })
  shortName: string;

  @Column({ unique: true })
  slug: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Store, (store) => store.region)
  stores: Store[];
}
