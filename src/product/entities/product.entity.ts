import {
  Column,
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductRemnant } from '../../productRemnants/entities/productRemnant.entity';
import { ProductType } from '../../productTypes/entities/productType.entity';

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

  @Column({ name: 'name', type: 'json' })
  name: JSON;

  @Column({ name: 'short_name', type: 'json' })
  shortName: JSON;

  @Column({ nullable: true })
  atc: string;

  @Column({ unique: true })
  slug: string;

  @Column({ name: 'cdn_instruction', type: 'json', nullable: true })
  cdnInstruction: JSON;

  @Column({ name: 'description', type: 'json', nullable: true })
  description: JSON;

  @Column({ name: 'instruction_uk', unique: true })
  instructionUk: string;

  @Column({ name: 'instruction_ru', unique: true })
  instructionRu: string;

  @Column({ name: 'instruction_en', unique: true })
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

  @Column({ name: 'seo_text', type: 'json', nullable: true })
  seoText: JSON;

  @Column({ name: 'seo_text_auto', default: true })
  seoTextAuto: boolean;

  @Column({ default: 0 })
  price: number;

  @Column({ name: 'discount_price', default: 0 })
  discountPrice: number;

  @Column({ name: 'reviews_count', default: 0 })
  reviewsCount: number;

  @Column({ name: 'rating', default: 0 })
  rating: number;

  @Column({ name: 'active', default: false })
  isActive: boolean;

  @Column({ name: 'hidden', default: true })
  isHidden: boolean;

  @Column({ name: 'in_stock', default: false })
  inStoke: boolean;

  @Column({ name: 'is_prescription', default: false })
  isPrescription: boolean;

  @Column({ name: 'product_type_id', default: false })
  productTypeId: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => ProductRemnant, (productRemnant) => productRemnant.product)
  productRemnants: ProductRemnant[];

  @OneToOne(() => ProductType, (productType) => productType.product) // Specify inverse side
  @JoinColumn({ name: 'productTypeId' })
  productType: ProductType;
}

export default Product;
