import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Product } from '../../product/entities/product.entity';

@Entity({
  name: 'badges',
})
export class Badge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'json' })
  title: JSON;

  @Column({ unique: true })
  slug: string;

  @Column({ length: 8, nullable: true })
  color: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToMany(() => Product)
  @JoinTable()
  products: Product[];
}
