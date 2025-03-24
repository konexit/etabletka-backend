import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Store } from 'src/stores/store/entities/store.entity';

export class UpdateKatottgDto {
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  name: JSON;

  @IsOptional()
  @IsString()
  region: string;

  @IsOptional()
  @IsString()
  regDistrict: string;

  @IsOptional()
  @IsString()
  regDistCommunity: string;

  @IsOptional()
  @IsString()
  regDistCommSettlement: string;

  @IsOptional()
  @IsString()
  objectCategory: string;

  @IsOptional()
  @IsString()
  prefix: JSON;

  @IsOptional()
  @IsString()
  lat: string;

  @IsOptional()
  @IsString()
  lng: string;

  @IsOptional()
  stores: Store[];
}
