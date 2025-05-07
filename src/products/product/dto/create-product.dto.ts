import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsJSON,
  IsString,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { LangContentDto } from 'src/common/dto/lang.dto';

export class CreateProduct {
  @IsNumber()
  @IsNotEmpty()
  syncId: number;

  @IsNumber()
  companyId: number;

  @IsNumber()
  brandId: number;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => LangContentDto)
  name: LangContentDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => LangContentDto)
  shortName: LangContentDto;

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
