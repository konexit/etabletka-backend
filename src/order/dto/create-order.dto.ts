import {
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateOrder {
  @IsNumber()
  @IsOptional()
  companyId: number;

  @IsNumber()
  @IsOptional()
  userId: number;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsNumber()
  @IsNotEmpty()
  cityId: number;

  @IsNumber()
  storeId: number;

  @IsNumber()
  @IsOptional()
  type: number;

  @IsNumber()
  @IsNotEmpty()
  deliveryTypeId: number;

  @IsNumber()
  @IsNotEmpty()
  paymentTypeId: number;

  @IsNumber()
  @IsOptional()
  orderStatus: number;

  @IsNumber()
  @IsOptional()
  paymentStatus: number;

  @IsNumber()
  @IsOptional()
  deliveryStatus: number;

  @IsNumber()
  @IsOptional()
  sentStatus: number;

  @IsNumber()
  @IsNotEmpty()
  totalProduct: number;

  @IsNumber()
  @IsOptional()
  totalShipping: number;

  @IsNumber()
  @IsNotEmpty()
  total: number;

  @IsString()
  @IsOptional()
  currency: string;

  @IsString()
  @IsOptional()
  comment: string;

  @IsJSON()
  @IsNotEmpty()
  recipientData: JSON;

  @IsJSON()
  @IsNotEmpty()
  deliveryData: JSON;

  @IsJSON()
  @IsNotEmpty()
  paymentData: JSON;

  @IsJSON()
  @IsNotEmpty()
  data: JSON;
}
