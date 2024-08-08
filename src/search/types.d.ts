declare namespace Search {
  export type FacetSearchMap = {
    attributes: Record<string, any>;
    attributesValue: Record<string, any>;
  };

  type FilterCheckBoxValue = {
    name: string;
    alias: string;
    count: number;
  };

  type FilterRangeValue = {
    name: string;
    alias: string;
    min: number;
    max: number;
  };

  export type FilterValues = FilterCheckBoxValue[] | FilterRangeValue;
}
