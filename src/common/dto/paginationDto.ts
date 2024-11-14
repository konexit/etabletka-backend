import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsNumber()
  @Min(15)
  @Type(() => Number)
  readonly take?: number = 15;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  readonly skip?: number = 0;
}
