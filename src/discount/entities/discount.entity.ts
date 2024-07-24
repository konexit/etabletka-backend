import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { DiscountGroup } from '../../discountGroup/entities/discount-group.entity';

@Entity({
  name: 'discounts',
})
export class Discount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'json' })
  name: JSON;

  @Column({ unique: true })
  slug: string;

  @Column({ name: 'cdn_data', type: 'json', nullable: true })
  cdnData: JSON;

  // 1 - is %; 2 - is UAH;
  @Column({ default: 1 })
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

  @Column({ name: 'discount_price', default: 0 })
  discountPrice: number;

  @ManyToMany(() => Product)
  @JoinTable()
  products: Product[];

  @ManyToMany(() => DiscountGroup)
  @JoinTable()
  discountGroups: DiscountGroup[];
}
