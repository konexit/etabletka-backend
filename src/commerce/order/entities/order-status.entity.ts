import { OrderTypes } from 'src/common/config/common.constants';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'order_statuses',
})
export class OrderStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'order_id', nullable: true })
  orderId: number;

  @Column({ name: 'trade_status_id', nullable: true, unique: true })
  tradeStatusId: number;

  @Column({ name: 'order_type_id', default: OrderTypes.Common })
  orderTypeId: number;

  @Column({ name: 'status_code' })
  statusCode: string;

  @Column({ name: 'status_msg', nullable: true })
  statusMsg: string;

  @Column({ name: 'status_time', type: 'timestamp', nullable: true })
  statusTime: Date;

  @Column({ name: 'sent_status_time', type: 'timestamp', nullable: true })
  sentStatusTime: Date;
}
