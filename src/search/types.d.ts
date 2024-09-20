declare namespace Search {
  export type FilterCheckBoxValue = {
    name: string;
    alias: string;
    count: number;
  };

  export type FilterRangeValue = {
    name: string;
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
    typeUI: TypeUI;
    values: AttributeValues[];
  };

  export type SelectedFilters = {
    type: string;
    key: string;
  };

  export type Attributes = {
    [key: string]: Attribute;
  };
}
