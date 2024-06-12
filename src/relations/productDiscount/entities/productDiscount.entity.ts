import { Column, Entity } from 'typeorm';

@Entity({
  name: 'product_discounts',
})
export class ProductDiscount {
  @Column({ name: 'product_id' })
  productId: number;

  @Column({ name: 'discount_id' })
  discountId: number;
}
