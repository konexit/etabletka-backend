import { IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CartOrderDto } from './cart-order.dto';

export class CartCreateDto {
	@IsOptional()
	@IsNumber()
	orderTypeId?: number;

	@IsOptional()
	@IsNumber()
	companyId?: number;

	@IsOptional()
	@IsNumber()
	storeId?: number;

	@IsOptional()
	@IsNumber()
	cityId?: number;

	@IsOptional()
	@ValidateNested()
	@Type(() => CartOrderDto)
	order?: CartOrderDto;
}
