import { Hits } from 'meilisearch';

export class Filter {
  api: string;
  name: string;
  order: number;
  alias: string;
  type: 'range' | 'checkbox';
  values: FilterCheckBoxValue[] | FilterRangeValue;
}

class FilterCheckBoxValue {
  name: string;
  alias: string;
  count: number;
}

class FilterRangeValue {
  name: string;
  alias: string;
  min: number;
  max: number;
}

export class FacetSearchFilterDto {
  filters: Filter[];
  products: Hits;
  limit: number;
  offset: number;
  estimatedTotalHits: number;
  query: string;
}
