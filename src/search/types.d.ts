declare namespace Search {
  export type FilterCheckBoxValue = {
    name: string;
    alias: string;
    count: number;
  };

  export type FilterRangeValue = {
    alias: string;
    min: number;
    max: number;
  };

  export type FilterValues = FilterCheckBoxValue[] | FilterRangeValue;

  export type AttributeValues = {
    icon: string | null;
    name: Record<string, any>;
    path: string | null;
    slug: string;
    color: string | null;
  };

  export enum Type {
    Import = 'import',
    Custom = 'custom'
  }

  export enum SectionViews {
    Main = 'main',
    Attributes = 'attributes',
    Preview = 'preview'
  }

  export type Attribute = {
    name: Record<string, any>;
    key: string;
    type: Type;
    order: number;
    sectionViews: SectionViews[];
    filter: boolean;
    filterUI: boolean;
    mergeKeys: string[];
    multipleValues: boolean;
    typeUI: TypeUI;
    values: AttributeValues[];
  };

  export type FilterAttr = {
    key: string;
    mergeKeys: string[];
    multipleValues: boolean;
  };

  export type SelectedCheckboxFilters = {
    type: string;
    key: string;
    sql: string;
    value: string[];
    privateFilter: boolean;
  };

  export type SelectedCheckboxFacetFilters = Record<string, any>;

  export type SelectedRangeFilters = {
    type: string;
    key: string;
    sql: string;
    min: number;
    max: number;
    privateFilter: boolean;
  };

  export type PrivateFilters = string[];

  export type SelectedFilters = SelectedCheckboxFilters | SelectedRangeFilters;

  export type Attributes = {
    [key: string]: Attribute;
  };
}
