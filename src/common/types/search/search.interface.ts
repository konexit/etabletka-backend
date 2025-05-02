export enum SearchIndexType {
  Products = 'products',
}

export interface SearchIndexConfig {
  name: SearchIndexType;
  localizedSlugMap: Record<string, Record<string, string>>;
  primaryKey: string;
  searchableAttr: string[];
  filterableAttr: string[];
  sortableAttr: string[];
  facetAttr?: string[];
}

export type SearchIndexesConfig = {
  [K in SearchIndexType]: SearchIndexConfig;
};
