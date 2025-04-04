import {
  Column,
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ProductRemnant } from 'src/products/remnants/entities/product-remnant.entity';
import { ProductType } from 'src/products/types/entities/product-type.entity';
import { Badge } from 'src/products/badge/entities/badge.entity';
import { Discount } from 'src/promo/discount/entities/discount.entity';
import { Brand } from 'src/brands/entities/brand.entity';
import { ProductGroup } from 'src/products/groups/entities/product-group.entity';
import { ProductComment } from 'src/products/comment/entities/product-comment.entity';

@Entity({
  name: 'products',
})
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'sync_id', unique: true })
  syncId: number;

  @Column({ name: 'company_id', nullable: true })
  companyId: number;

  @Column({ name: 'brand_id', nullable: true })
  brandId: number;

  @Column({ type: 'jsonb' })
  name: JSON;

  @Column({ name: 'short_name', type: 'jsonb' })
  shortName: JSON;

  @Column({ nullable: true })
  atc: string;

  @Column({ unique: true })
  slug: string;

  @Column({ name: 'cdn_data', type: 'jsonb', nullable: true })
  cdnData: JSON;

  @Column({ name: 'cdn_instruction', type: 'jsonb', nullable: true })
  cdnInstruction: JSON;

  @Column({ name: 'instruction_uk', nullable: true })
  instructionUk: string;

  @Column({ name: 'instruction_ru', nullable: true })
  instructionRu: string;

  @Column({ name: 'instruction_en', nullable: true })
  instructionEn: string;

  @Column({ name: 'seo_h1', type: 'json', nullable: true })
  seoH1: JSON;

  @Column({ name: 'seo_title', type: 'jsonb', nullable: true })
  seoTitle: JSON;

  @Column({ name: 'seo_description', type: 'jsonb', nullable: true })
  seoDescription: JSON;

  @Column({ default: 0, type: 'float' })
  price: number;

  @Column({ name: 'reviews_count', default: 0 })
  reviewsCount: number;

  @Column({ name: 'rating', default: 0 })
  rating: number;

  @Column({ name: 'active', default: false })
  isActive: boolean;

  @Column({ name: 'hidden', default: false })
  isHidden: boolean;

  @Column({ name: 'search_engine', default: true })
  searchEngine: boolean;

  @Column({ name: 'in_stock', default: false })
  inStoke: boolean;

  @Column({ name: 'is_prescription', default: false })
  isPrescription: boolean;

  @Column({ name: 'product_type_id', default: 1 })
  productTypeId: number;

  @Column({ name: 'morion_code', default: 0 })
  morionCode: number;

  @Column({ type: 'jsonb', nullable: true })
  attributes: JSON;

  @Column({ name: 'categories', type: 'int', array: true, default: () => `'{}'::integer[]` })
  categories: number[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => ProductRemnant, (productRemnant: ProductRemnant) => productRemnant.product)
  productRemnants: ProductRemnant[];

  @OneToMany(() => ProductComment, (productComment: ProductComment) => productComment.product)
  @JoinColumn({ name: 'id', referencedColumnName: 'product_id' })
  productComments: ProductComment[];

  @ManyToOne(() => ProductType, (productType: ProductType) => productType.products)
  @JoinColumn({ name: 'product_type_id' })
  productType: ProductType;

  @ManyToOne(() => Brand, (brand: Brand) => brand.products)
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @ManyToMany(() => Badge)
  @JoinTable({ name: 'products_badges' })
  badges: Badge[];

  @ManyToMany(() => Discount)
  @JoinTable({ name: 'products_discounts' })
  discounts: Discount[];

  @ManyToMany(() => ProductGroup)
  @JoinTable({ name: 'products_groups' })
  productGroups: ProductGroup[];
}
