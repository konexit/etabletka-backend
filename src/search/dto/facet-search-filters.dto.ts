import { Hits } from 'meilisearch';
import { SearchFilterUIType } from 'src/common/types/search/search.enum';
import { SearchFilterValues } from 'src/common/types/search/search.interface';

export class FilterDto {
  name: string;
  order: number;
  alias: string;
  typeUI: SearchFilterUIType;
  values: SearchFilterValues;
}

export class FacetSearchFilterDto {
  filters: FilterDto[];
  products: Hits;
  limit: number;
  offset: number;
  estimatedTotalHits: number;
  query: string;
}
