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
import { Product } from 'src/products/product/entities/product.entity';
import { Store } from 'src/stores/store/entities/store.entity';
import { Transform } from 'class-transformer';

@Entity({
  name: 'product_remnants',
})
export class ProductRemnant {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ name: 'product_id' })
  productId: number;

  @Column({ name: 'store_id', default: 0 })
  storeId: number;

  @Column({ type: 'decimal', precision: 1000, scale: 3, default: 0 })
  @Transform(({ value }) => Number.parseFloat(value))
  quantity: number;

  @Column({ name: 'active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Product, (product) => product.productRemnants)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Store, (store: Store) => store.productRemnants)
  @JoinColumn({ name: 'store_id' })
  store: Store;
}
