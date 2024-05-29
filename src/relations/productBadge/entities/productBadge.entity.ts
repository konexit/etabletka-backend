import { Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Product } from '../../../product/entities/product.entity';
import { Badge } from '../../../badge/entities/badge.entity';

@Entity({
  name: 'product_badges',
})
export class ProductBadge {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.productBadges)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Badge, (badge) => badge.productBadges)
  @JoinColumn({ name: 'badge_id' })
  badge: Badge;
}
