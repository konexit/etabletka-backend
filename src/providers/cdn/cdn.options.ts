import { ICDNUploadOptions } from './cdn.interface';

export class CDNUploadOptions implements ICDNUploadOptions {
  constructor(
    public path: string,
    public input: string = 'file'
  ) { }

  getQueryParams(): string {
    const query: string[] = [];

    if (this.path) {
      query.push(`path=${this.path}`);
    }

    if (this.input) {
      query.push(`input=${this.input}`);
    }

    return query.length > 0 ? `?${query.join('&')}` : '';
  }
}