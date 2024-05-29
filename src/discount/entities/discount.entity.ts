import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { ProductDiscount } from '../../relations/productDiscount/entities/productDiscount.entity';

@Entity({
  name: 'discounts',
})
export class Discount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'json' })
  title: JSON;

  @Column({ type: 'json', nullable: true })
  text: JSON;

  @Column({ unique: true })
  slug: string;

  @Column({ name: 'badge_title', type: 'json', nullable: true })
  badgeTitle: JSON;

  @Column({ name: 'badge_color', nullable: true, length: 8 })
  badgeColor: string;

  @Column({ default: 0 })
  type: number;

  @Column({ default: 0, type: 'float' })
  value: number;

  @Column({ default: 'UAH', length: 10 })
  currency: string;

  @Column({ name: 'active', default: false })
  isActive: boolean;

  @Column({ name: 'start_date', type: 'timestamp', nullable: true })
  publishStart: Date;

  @Column({ name: 'end_date', type: 'timestamp', nullable: true })
  publishEnd: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => ProductDiscount, (productDiscount) => productDiscount.discount)
  productDiscounts: ProductDiscount[];
}
