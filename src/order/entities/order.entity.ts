import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'orders',
})
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'company_id', default: 1 })
  companyId: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @Column({ nullable: true, length: 15 })
  phone: string;

  @Column({ name: 'city_id', nullable: true })
  cityId: number;

  @Column({ name: 'store_id', nullable: true })
  storeId: number;

  @Column({ default: 0 })
  type: number;

  @Column({ name: 'delivery_type_id' })
  deliveryTypeId: number;

  @Column({ name: 'payment_type_id', default: 2 })
  paymentTypeId: number;

  @Column({ name: 'order_status', default: 1 })
  orderStatus: number;

  @Column({ name: 'payment_status', default: 1 })
  paymentStatus: number;

  @Column({ name: 'delivery_status', nullable: true })
  deliveryStatus: number;

  @Column({ name: 'sent_status', nullable: true })
  sentStatus: number;

  @Column({ name: 'total_product', default: 0, type: 'float' })
  totalProduct: number;

  @Column({ name: 'total_shipping', default: 0, type: 'float' })
  totalShipping: number;

  @Column({ default: 0, type: 'float' })
  total: number;

  @Column({ default: 'UAH', length: 30 })
  currency: string;

  @Column({ type: 'text' })
  comment: string;

  @Column({ name: 'recipient_data', type: 'json', nullable: true })
  recipientData: JSON;

  @Column({ name: 'delivery_data', type: 'json', nullable: true })
  deliveryData: JSON;

  @Column({ name: 'payment_data', type: 'json', nullable: true })
  paymentData: JSON;

  @Column({ type: 'json', nullable: true })
  data: JSON;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
