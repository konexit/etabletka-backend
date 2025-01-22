import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'order_statuses_descriptions',
})
export class OrderStatusDescription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'trade_status_id', nullable: true })
  orderID: string;

  @Column({ name: 'code' })
  code: string;

  @Column({ name: 'type' })
  type: string;

  @Column({ name: 'order_index' })
  orderIndex: number;

  @Column({ name: 'is_manual', default: false })
  IsManual: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
