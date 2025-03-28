import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Store } from 'src/store/entities/store.entity';

@Entity({
  name: 'katottg',
})
export class Katottg {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_level' })
  region: string;

  @Column({ name: 'second_level' })
  regDistrict: string;

  @Column({ name: 'third_level' })
  regDistCommunity: string;

  @Column({ name: 'fourth_level' })
  regDistCommSettlement: string;

  @Column({ name: 'additional_level' })
  addCityDistrict: string;

  @Column({ name: 'object_category' })
  objectCategory: string;

  @Column({ name: 'name', type: 'jsonb' })
  name: JSON;

  @Column({ name: 'prefix', type: 'jsonb', nullable: true })
  prefix: JSON;

  @Column({ nullable: true })
  lat: string;

  @Column({ nullable: true })
  lng: string;

  @Column({ unique: true })
  slug: string;

  @Exclude()
  storesCount: number;
  
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Store, (store) => store.katottg)
  stores: Store[];
}
