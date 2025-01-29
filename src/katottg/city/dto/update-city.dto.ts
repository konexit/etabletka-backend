import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Store } from 'src/stores/store/entities/store.entity';

export class UpdateCity {
  @IsOptional()
  @IsString()
  name: JSON;

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
  @IsNumber()
  countryId: number;

  @IsOptional()
  @IsNumber()
  regionId: number;

  @IsOptional()
  @IsNumber()
  districtId: number;

  @IsOptional()
  @IsNumber()
  communityId: number;

  @IsOptional()
  stores: Store[];
}
