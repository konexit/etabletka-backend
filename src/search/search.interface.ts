interface IndexConfig {
  name: string;
  primaryKey: string;
  searchableAttr: string[];
  filterableAttr: string[];
  facetAttr?: string[];
}

interface IndexesConfig {
  [indexName: string]: IndexConfig;
}
