import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn, ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Product } from "../../product/entities/product.entity";

@Entity('product_comments')
export class ProductComment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'product_id' })
  productId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'parent_id', nullable: true })
  parentId: number;

  @Column({ type: 'text' })
  comment: string;

  @Column({ name: 'is_approved', default: false })
  isApproved: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.productComments)
  @JoinColumn({ name: 'user_id' })
  author: User;

  @ManyToOne(() => Product, (product: Product) => product.productComments)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
