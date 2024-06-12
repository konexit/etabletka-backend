import {
  Column,
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ProductRemnant } from '../../productRemnants/entities/productRemnant.entity';
import { ProductType } from '../../productTypes/entities/productType.entity';
import { Badge } from '../../badge/entities/badge.entity';
import { Discount } from '../../discount/entities/discount.entity';

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

  @Column({ name: 'cdn_instruction', type: 'json', nullable: true })
  cdnInstruction: JSON;

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

  @Column({ default: 0, type: 'float' })
  price: number;

  @Column({ name: 'discount_price', default: 0 })
  discountPrice: number;

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

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => ProductRemnant, (productRemnant) => productRemnant.product)
  productRemnants: ProductRemnant[];

  @OneToOne(() => ProductType, (productType) => productType.product)
  @JoinColumn({ name: 'product_type_id' })
  productType: ProductType;

  @ManyToMany(() => Badge, (badge) => badge.products)
  @JoinTable({
    name: 'product_badges',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'badge_id', referencedColumnName: 'id' },
  })
  badges: Badge[];

  @ManyToMany(() => Discount, (discount) => discount.products)
  @JoinTable({
    name: 'product_discounts',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'discount_id', referencedColumnName: 'id' },
  })
  discounts: Discount[];
}
