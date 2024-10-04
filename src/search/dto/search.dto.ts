import { IsString, Length } from 'class-validator';

export class SearchDto {
  @Length(0, 255)
  @IsString()
  text: string;
  lang?: string;
  limit?: number;
  offset?: number;
  filter?: string;
  sort?: string[];
}
