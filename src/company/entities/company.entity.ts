import { Store } from 'src/store/entities/store.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'companies',
})
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'sync_id', nullable: true })
  syncId: number;

  @Column({ name: 'edrpou', type: 'bigint' })
  edrpou: number;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ name: 'cdn_data', type: 'jsonb', nullable: true })
  cdnData: JSON;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Store, (store) => store.company)
  stores: Store[];
}
