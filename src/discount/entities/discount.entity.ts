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

  @Column({ name: 'discount_price', default: 0 })
  discountPrice: number;

  @ManyToMany(() => Product, (product) => product.discounts)
  @JoinTable({
    name: 'product_discounts',
    joinColumn: { name: 'discount_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'product_id', referencedColumnName: 'id' },
  })
  products: Product[];

  @ManyToMany(
    () => DiscountGroup,
    (discountGroup: DiscountGroup) => discountGroup.discounts,
  )
  @JoinTable({
    name: 'discounts_groups',
    joinColumn: { name: 'discount_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'group_id', referencedColumnName: 'id' },
  })
  discountGroups: DiscountGroup[];
}
