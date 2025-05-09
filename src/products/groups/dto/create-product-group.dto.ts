import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ProductGroup } from '../entities/product-group.entity';
import { LangContentDto } from 'src/common/dto/lang.dto';
import { Type } from 'class-transformer';

export class CreateProductGroupDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => LangContentDto)
  name: LangContentDto;

  @IsOptional()
  @IsString()
  slug: string;

  @IsOptional()
  @IsBoolean()
  root: boolean;

  @IsOptional()
  @IsNumber()
  parentId: ProductGroup['id'];
}
