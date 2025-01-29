import { Exclude, Expose } from 'class-transformer';
import { Page } from '../entities/page.entity';

@Exclude()
export class ResponsePageDto {
  constructor(partial: Page & Record<string, any>, langKey: string = 'uk') {
    const pageObject = JSON.parse(JSON.stringify(partial));

    pageObject.title = partial.title[langKey] || null;
    pageObject.text = partial.text[langKey] || null;

    return Object.assign(this, pageObject);
  }

  @Expose()
  id: number;

  @Expose()
  slug: string;

  @Expose()
  title: string | null;

  @Expose()
  text: string | null;
}
