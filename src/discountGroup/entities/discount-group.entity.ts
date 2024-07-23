import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Discount } from '../../discount/entities/discount.entity';

@Entity({
  name: 'discount_groups',
})
export class DiscountGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'json' })
  name: JSON;

  @Column({ unique: true })
  slug: string;

  @Column({ name: 'cdn_data', type: 'json', nullable: true })
  cdnData: JSON;

  @Column({ name: 'active', default: true })
  isActive: boolean;

  @Column({ name: 'special', default: false })
  isSpecial: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToMany(() => Discount, (discount) => discount.discountGroups)
  @JoinTable({
    name: 'discounts_groups',
    joinColumn: { name: 'group_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'discount_id', referencedColumnName: 'id' },
  })
  discounts: Discount[];
}
