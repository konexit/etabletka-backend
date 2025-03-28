import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'order_carts',
})
export class OrderCart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'trade_order_id', nullable: true })
  tradeOrderId: number;

  @Column({ name: 'order_type_id', default: 1 })
  orderTypeId: number;

  @Column({ name: 'store_id', nullable: true })
  storeId: number;

  @Column({ name: 'company_id', default: 1 })
  companyId: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @Column({ name: 'katottg_id', nullable: true })
  katottgId: number;

  @Column({ type: 'jsonb', nullable: true })
  order: Cart.Order;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
