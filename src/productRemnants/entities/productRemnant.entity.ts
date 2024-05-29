import {
  Column,
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from '../../product/entities/product.entity';

@Entity({
  name: 'product_remnants',
})
export class ProductRemnant {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ name: 'product_id' })
  productId: number;

  @ManyToOne(() => Product, (product) => product.productRemnants)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'store_id', default: 0 })
  storeId: number;

  @Column({ name: 'quantity', default: 0 })
  quantity: number;

  @Column({ name: 'active', default: false })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
