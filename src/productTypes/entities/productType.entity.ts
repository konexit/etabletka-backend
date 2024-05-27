import { Column, Entity, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Product } from '../../product/entities/product.entity';

@Entity({
  name: 'product_types',
})
export class ProductType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200, unique: true })
  name: string;

  @OneToOne(() => Product, (product) => product.productType)
  product: Product;
}

export default ProductType;
