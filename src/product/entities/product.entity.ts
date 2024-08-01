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
import { Category } from '../../categories/entities/category.entity';
import { ProductRemnant } from '../../productRemnants/entities/product-remnant.entity';
import { ProductType } from '../../productTypes/entities/product-type.entity';
import { Badge } from '../../badge/entities/badge.entity';
import { Discount } from '../../discount/entities/discount.entity';
import { Brand } from '../../brands/entities/brand.entity';

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

  @Column({ type: 'json' })
  name: JSON;

  @Column({ name: 'short_name', type: 'json' })
  shortName: JSON;

  @Column({ nullable: true })
  atc: string;

  @Column({ unique: true })
  slug: string;

  @Column({ name: 'cdn_data', type: 'json', nullable: true })
  cdnData: JSON;

  @Column({ name: 'cdn_instruction', type: 'json', nullable: true })
  cdnInstruction: JSON;

  @Column({ name: 'instruction_uk', nullable: true })
  instructionUk: string;

  @Column({ name: 'instruction_ru', nullable: true })
  instructionRu: string;

  @Column({ name: 'instruction_en', nullable: true })
  instructionEn: string;

  @Column({ name: 'seo_h1', type: 'json', nullable: true })
  seoH1: JSON;

  @Column({ name: 'seo_h1_auto', default: true })
  seoH1Auto: boolean;

  @Column({ name: 'seo_title', type: 'json', nullable: true })
  seoTitle: JSON;

  @Column({ name: 'seo_title_auto', default: true })
  seoTitleAuto: boolean;

  @Column({ name: 'seo_description', type: 'json', nullable: true })
  seoDescription: JSON;

  @Column({ name: 'seo_description_auto', default: true })
  seoDescriptionAuto: boolean;

  @Column({ name: 'seo_keywords', type: 'json', nullable: true })
  seoKeywords: JSON;

  @Column({ name: 'seo_keywords_auto', default: true })
  seoKeywordsAuto: boolean;

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

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(
    () => ProductRemnant,
    (productRemnant: ProductRemnant) => productRemnant.product,
  )
  productRemnants: ProductRemnant[];

  @ManyToOne(
    () => ProductType,
    (productType: ProductType) => productType.products,
  )
  @JoinColumn({ name: 'product_type_id' })
  productType: ProductType;

  @ManyToOne(() => Brand, (brand: Brand) => brand.products)
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @ManyToMany(() => Badge)
  @JoinTable({
    name: 'cross_badges_products',
  })
  badges: Badge[];

  @ManyToMany(() => Discount)
  @JoinTable({
    name: 'cross_discounts_products',
  })
  discounts: Discount[];

  @ManyToMany(() => Category)
  @JoinTable({
    name: 'cross_categories_products',
  })
  categories: Category[];
}
