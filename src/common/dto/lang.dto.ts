import { LangContent } from '../types/common/general.interface';
import { IsString } from 'class-validator';

export class LangContentDto implements LangContent {
  @IsString()
  uk: string;
}
