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
  orderID: string;

  @Column({ name: 'status_code' })
  statusCode: string;

  @Column({ name: 'status_msg', nullable: true })
  statusMsg: string;

  @Column({ name: 'status_time', type: 'timestamp', nullable: true })
  statusTime: Date;

  @Column({ name: 'sent_status_time', type: 'timestamp', nullable: true })
  sentStatusTime: Date;
}
