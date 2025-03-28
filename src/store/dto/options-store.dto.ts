import { IsOptional, IsString, Matches, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from 'src/common/dto/pagination.dto';

class WhereDto {
  @IsOptional()
  @Type(() => Boolean)
  isActive?: boolean;
}

class OrderByDto {
  @IsOptional()
  @Type(() => Boolean)
  isActive?: boolean;

  @IsOptional()
  @Matches(/^(ASC|DESC)$/i, { message: 'name must be "ASC" or "DESC"' })
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
}