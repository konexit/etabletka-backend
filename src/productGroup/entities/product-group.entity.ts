import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from '../../product/entities/product.entity';

@Entity({
  name: 'product_groups',
})
export class ProductGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'A-Derma',
    description: 'Name of the product category',
  })
  @Column({ length: 200, unique: true })
  name: string;

  @ApiProperty({
    example: 'A-Derma',
    description: 'The slug using for url use empty for auto generation',
  })
  @Column({ length: 50, unique: true })
  slug: string;

  @ApiProperty({
    example: 'true',
    description: 'Use true if the ProductGroup is root. ParentId - must be null',
  })
  @Column({ default: false })
  root: boolean;

  @ApiProperty({
    example: '1',
    description: 'ParentId - must be null if ROOT is true',
  })
  @Column({ name: 'parent_id', default: null })
  parentId: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ApiProperty({
    example: '[50363,50364,50362]',
    description: 'Array of products SyncId',
  })
  @ManyToMany(() => Product)
  @JoinTable({
    name: 'cross_groups_products',
  })
  products: Product[];
}
