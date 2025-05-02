import {
  SearchFilterUIType,
  SearchIndexDataSource,
  SearchIndexType,
  SearchUISection,
  SearchUploadDataSource
} from "./search.enum";

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

export type SearchFilterCheckBoxValue = {
  name: string;
  alias: string;
  count: number;
};

export type SearchFilterRangeValue = {
  alias: string;
  min: number;
  max: number;
};

export type SearchFilterValues = SearchFilterCheckBoxValue[] | SearchFilterRangeValue;

export type SearchAttributeValues = {
  icon: string | null;
  name: Record<string, any>;
  path: string | null;
  slug: string;
  color: string | null;
};

export type SearchAttribute = {
  name: Record<string, any>;
  key: string;
  type: SearchUploadDataSource;
  order: number;
  sectionViews: SearchUISection[];
  searchEngine: boolean;
  ui: boolean;
  mergeKeys: string[];
  multipleValues: boolean;
  typeUI: SearchFilterUIType;
  typeSource: SearchIndexDataSource;
  values: SearchAttributeValues[];
};

export type SearchFilterAttr = {
  key: string;
  mergeKeys: string[];
  multipleValues: boolean;
  typeSource: SearchIndexDataSource;
};

export type SearchSelectedCheckboxFilters = {
  type: string;
  key: string;
  sql: string;
  value: string[];
  privateFilter: boolean;
};

export type SearchSelectedCheckboxFacetFilters = Record<string, any>;

export type SearchSelectedRangeFilters = {
  type: string;
  key: string;
  sql: string;
  min: number;
  max: number;
  privateFilter: boolean;
};

export type SearchPrivateFilters = string[];

export type SearchSelectedFilters = SearchSelectedCheckboxFilters | SearchSelectedRangeFilters;

export type SearchAttributes = {
  [key: string]: SearchAttribute;
};