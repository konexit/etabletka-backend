import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsNumber()
  @Min(16)
  take?: number = 16;

  @IsOptional()
  @IsNumber()
  @Min(0)
  skip?: number = 0;
}
