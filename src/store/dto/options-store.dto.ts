import { IsOptional, IsString, Matches, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Store } from '../entities/store.entity';

class WhereDto {
  @IsOptional()
  @Type(() => Boolean)
  isActive?: boolean;
}

class OrderByDto {
  @IsOptional()
  @Matches(/^(ASC|DESC)$/, { message: 'name must be "ASC" or "DESC"' })
  name?: "ASC" | "DESC";
}

export class OptionsStoreDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => PaginationDto)
  pagination?: PaginationDto;

  @IsOptional()
  @IsString()
  lang?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => WhereDto)
  where?: WhereDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => OrderByDto)
  orderBy?: OrderByDto;

  @IsNumber({}, { each: true })
  @IsArray()
  ids?: Store['id'][];
}