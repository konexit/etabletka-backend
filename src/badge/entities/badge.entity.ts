import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ProductBadge } from '../../relations/productBadge/entities/productBadge.entity';

@Entity({
  name: 'badges',
})
export class Badge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'json' })
  title: JSON;

  @Column({ unique: true })
  slug: string;

  @Column({ length: 8, nullable: true })
  color: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => ProductBadge, (productBadge) => productBadge.badge)
  productBadges: ProductBadge[];
}
