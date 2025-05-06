import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class FilterCategoryDto {
	@IsOptional()
	@IsBoolean()
	@Type(() => Boolean)
	readonly root?: boolean;

	@IsOptional()
	@IsNumber()
	@Type(() => Number)
	readonly id?: number;

	@IsOptional()
	@IsNumber()
	@Type(() => Number)
	readonly parent_id?: number;

	@IsOptional()
	@IsString()
	@Type(() => String)
	readonly slug?: string;
}