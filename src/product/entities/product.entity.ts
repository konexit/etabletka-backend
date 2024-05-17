import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ProductRemnant } from '../../productRemnants/entities/productRemnant.entity';
@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  syncId: number;

  @Column({ nullable: true })
  companyId: number;

  @Column({ name: 'name', type: 'json' })
  name: JSON;

  @Column({ name: 'shortName', type: 'json' })
  shortName: JSON;

  @Column({ name: 'seoH1', type: 'json', nullable: true })
  seoH1: JSON;

  @Column({ name: 'seoTitle', type: 'json', nullable: true })
  seoTitle: JSON;

  @Column({ name: 'seoDescription', type: 'json', nullable: true })
  seoDescription: JSON;

  @Column({ name: 'seoKeywords', type: 'json', nullable: true })
  seoKeywords: JSON;

  @Column({ name: 'seoText', type: 'json', nullable: true })
  seoText: JSON;

  @Column({ default: 0 })
  price: number;

  @Column({ default: false })
  isActive: boolean;

  @Column({ default: false })
  inStoke: boolean;

  @OneToMany(() => ProductRemnant, (productRemnant) => productRemnant.product)
  productRemnants: ProductRemnant[];
}

export default Product;
