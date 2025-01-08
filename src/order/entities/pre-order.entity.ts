import { OrderJSON } from 'src/common/types/order';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'pre_orders',
})
export class Order {
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

  @Column({ name: 'city_id', nullable: true })
  cityId: number;

  @Column({ type: 'jsonb', nullable: true })
  order: OrderJSON;

  @Column({ name: 'move_to_order', default: false })
  moveToOrder: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
