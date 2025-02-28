import { IsNumber, IsOptional } from 'class-validator';

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
}
