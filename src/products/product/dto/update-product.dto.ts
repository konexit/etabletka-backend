import { IsOptional } from 'class-validator';

export class UpdateProduct {
  @IsOptional()
  syncId: number;

  @IsOptional()
  companyId: number;

  @IsOptional()
  brandId: number;

  @IsOptional()
  name: JSON;

  @IsOptional()
  shortName: JSON;

  @IsOptional()
  atc: string;

  @IsOptional()
  slug: string;

  @IsOptional()
  price: number;

  @IsOptional()
  rating: number;

  @IsOptional()
  productTypeId: number;

  @IsOptional()
  morionCode: number;

  @IsOptional()
  isActive: boolean;

  @IsOptional()
  isHidden: boolean;

  @IsOptional()
  inStoke: boolean;

  @IsOptional()
  isPrescription: boolean;

  @IsOptional()
  instructionUk: string;

  @IsOptional()
  instructionRu: string;

  @IsOptional()
  instructionEn: string;

  @IsOptional()
  seoH1: JSON;

  @IsOptional()
  seoDescription: JSON;

  @IsOptional()
  seoTitle: JSON;

  @IsOptional()
  attributes: JSON;

  @IsOptional()
  badges: [];

  @IsOptional()
  categories: [];

  @IsOptional()
  discounts: [];

  @IsOptional()
  productGroups: [];

  @IsOptional()
  productRemnants: [];
}
