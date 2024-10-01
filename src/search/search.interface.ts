interface IndexConfig {
  name: string;
  primaryKey: string;
  searchableAttr: string[];
  filterableAttr: string[];
  sortableAttr: string[];
  facetAttr?: string[];
}

interface IndexesConfig {
  [indexName: string]: IndexConfig;
}
