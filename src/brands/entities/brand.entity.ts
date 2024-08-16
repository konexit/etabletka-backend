import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn, ManyToOne, JoinColumn
} from "typeorm";
import { Exclude } from 'class-transformer';
import { Product } from "../../product/entities/product.entity";
@Entity({
  name: 'brands',
})
export class Brand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'sync_id', nullable: true, unique: true })
  @Exclude()
  syncId: number;

  @Column({ type: 'json', nullable: true })
  name: JSON;

  @Column({ nullable: true })
  slug: string;

  @Column({ nullable: true })
  image: string;

  @Column({ name: 'cdn_data', type: 'json', nullable: true })
  @Exclude()
  cdnData: JSON;

  @Column({ default: 0 })
  @Exclude()
  position: number;

  @Column({ default: true })
  @Exclude()
  active: boolean;

  @Column({ default: true })
  @Exclude()
  popular: boolean;

  @Column({ type: 'json', nullable: true })
  description: JSON;

  @Column({ name: 'seo_h1', type: 'json', nullable: true })
  seoH1: JSON;

  @Column({ name: 'seo_title', type: 'json', nullable: true })
  seoTitle: JSON;

  @Column({ name: 'seo_description', type: 'json', nullable: true })
  seoDescription: JSON;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  @Exclude()
  updatedAt: Date;

  @ManyToOne(() => Product, (product) => product.brand)
  products: Product[];
}
