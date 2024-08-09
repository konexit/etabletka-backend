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

  export type AttributesValue = {
    [key: string]: Record<string, any>;
  };

  export type AttributeValues = {
    icon: string | null;
    name: string;
    path: string | null;
    slug: string;
    color: string | null;
    filter: boolean;
    isPreview: boolean;
  };

  export enum TypeUI {
    Checkbox = 'checkbox',
    Range = 'range'
  }

  export type Attribute = {
    name: Record<string, any>;
    type: string;
    alias: string;
    order: number;
    filter: boolean;
    filterUI: boolean;
    typeUI: TypeUI;
    values: AttributeValues[];
  };

  export type Attributes = {
    [key: string]: Attribute;
  };

  export type FacetSearchMap = {
    attributes: Attributes;
    attributesValue: AttributesValue;
  };
}
