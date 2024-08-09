import { Hits } from 'meilisearch';

export enum TypeUI {
  Checkbox = 'checkbox',
  Range = 'range'
}

export class Filter {
  name: string;
  order: number;
  alias: string;
  typeUI: TypeUI;
  values: Search.FilterValues;
}

export class FacetSearchFilterDto {
  filters: Filter[];
  products: Hits;
  limit: number;
  offset: number;
  estimatedTotalHits: number;
  query: string;
}
