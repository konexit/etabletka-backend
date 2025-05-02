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

/**
 * Supported filter types:
 * 
 * - `range`: Specifies a range for the key. The format is `[key:value1-value2]` with a `-` separator.
 *   Example:
 *   - `price:50-1000`
 * 
 * - `checkbox`: Specifies multiple values for the key. The format is `[key:value1,value2,value3]` with a `,` separator.
 *   Example:
 *   - `production-form:kapsuly,klipsa,shampun`
 * 
 * All filters can be private by adding an underscore `_` to the beginning of the key.
 * 
 * Example for a private filter:
 * - `_key`:value1,value2,value3
 */
export interface SearchFacetFilter {
  type: SearchFilterUIType;
  filter: string;
};

export interface SearchSelectedCheckboxFilters {
  type: SearchFilterUIType.Checkbox;
  key: string;
  privateFilter: boolean;
  value: string[];
  sql: string;
}

export interface SearchSelectedRangeFilters {
  type: SearchFilterUIType.Range;
  key: string;
  privateFilter: boolean;
  min: number;
  max: number;
  sql: string;
}

export type SearchFacetFilters = SearchFacetFilter[];

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

export type SearchSelectedCheckboxFacetFilters = Record<string, any>;

export type SearchPrivateFilters = string[];

export type SearchSelectedFilters = SearchSelectedCheckboxFilters | SearchSelectedRangeFilters;

export type SearchAttributes = {
  [key: string]: SearchAttribute;
};