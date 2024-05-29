import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../../../product/entities/product.entity';
import { Discount } from '../../../discount/entities/discount.entity';

@Entity({
  name: 'product_discounts',
})
export class ProductDiscount {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.productDiscounts)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Discount, (discount) => discount.productDiscounts)
  @JoinColumn({ name: 'discount_id' })
  discount: Discount;
}
