import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Product } from '../../product/entities/product.entity';

@Entity({
  name: 'product_types',
})
export class ProductType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'sync_id', nullable: true, unique: true })
  @Exclude()
  syncId: number;

  @Column({ length: 200, unique: true })
  name: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToOne(() => Product, (product) => product.productType)
  product: Product;
}
