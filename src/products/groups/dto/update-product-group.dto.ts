import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { LangContentDto } from 'src/common/dto/lang.dto';
import { ProductGroup } from '../entities/product-group.entity';

export class UpdateProductGroupDto {
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
