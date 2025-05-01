export enum SearchIndexType {
  Products = 'products',
}

export interface SearchIndexConfig {
  name: SearchIndexType;
  primaryKey: string;
  searchableAttr: string[];
  filterableAttr: string[];
  sortableAttr: string[];
  facetAttr?: string[];
}

export type SearchIndexesConfig = {
  [K in SearchIndexType]: SearchIndexConfig;
};
