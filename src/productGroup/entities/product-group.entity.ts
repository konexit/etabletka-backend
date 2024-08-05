import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from '../../product/entities/product.entity';

@Entity({
  name: 'product_group',
})
export class ProductGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200, unique: true })
  name: string;

  @Column({ length: 50, unique: true })
  slug: string;

  @Column({ default: false })
  root: boolean;

  @Column({ name: 'parent_id', default: 0 })
  parentId: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToMany(() => Product)
  @JoinTable({
    name: 'cross_groups_products',
  })
  products: Product[];
}
