import { IsNotEmpty, IsString, Length } from 'class-validator';

export class SearchDto {
  @IsNotEmpty()
  @Length(2, 255)
  @IsString()
  text: string;
  lang?: string;
  limit?: number;
  offset?: number;
  filter?: string;
  sort?: string[];
}
