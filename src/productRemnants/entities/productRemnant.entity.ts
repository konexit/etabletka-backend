import {
  Column,
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
} from 'typeorm';
import { Product } from '../../product/entities/product.entity';

@Entity()
export class ProductRemnant {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  productId: number;

  @ManyToOne(() => Product, (product) => product.productRemnants)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ default: 1 })
  storeId: number;

  @Column({ name: 'quantity', default: 0 })
  quantity: number;

  @Column({ default: false })
  isActive: boolean;
}

export default ProductRemnant;
