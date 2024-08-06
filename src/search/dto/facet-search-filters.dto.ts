import { Hits } from 'meilisearch';

export type FilterValues = FilterCheckBoxValue[] | FilterRangeValue;

export enum TypeUI {
  Checkbox = 'checkbox',
  Range = 'range'
}

export class Filter {
  api: string;
  name: string;
  order: number;
  alias: string;
  typeUI: TypeUI;
  values: FilterValues;
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
