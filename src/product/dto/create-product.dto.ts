import {
  IsNotEmpty,
  IsNumber,
  IsJSON,
  IsString,
  IsBoolean,
} from 'class-validator';

export class CreateProductDto {
  @IsNumber()
  @IsNotEmpty()
  syncId: number;

  @IsNumber()
  companyId: number;

  @IsNumber()
  brandId: number;

  @IsJSON()
  @IsNotEmpty()
  name: JSON;

  @IsJSON()
  @IsNotEmpty()
  shortName: JSON;

  @IsString()
  atc: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsJSON()
  cdnInstruction: JSON;

  @IsJSON()
  description: JSON;

  @IsString()
  instructionUk: string;

  @IsString()
  instructionRu: string;

  @IsString()
  instructionEn: string;

  @IsJSON()
  seoH1: JSON;

  @IsJSON()
  seoTitle: JSON;

  @IsJSON()
  seoDescription: JSON;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  discountPrice: number;

  @IsNumber()
  rating: number;

  @IsNumber()
  reviewsCount: number;

  @IsBoolean()
  isActive: boolean;

  @IsBoolean()
  isHidden: boolean;

  @IsBoolean()
  inStoke: boolean;

  @IsBoolean()
  isPrescription: boolean;

  @IsNumber()
  productTypeId: number;
}
export default CreateProductDto;
