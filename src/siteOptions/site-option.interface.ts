interface productAttributeConfig {
  attrKey: string,
  attrValueKey: string,
  attrKeyCache: string,
  valueKeyCache: string,
  default: FacetSearchMap
}

interface FacetSearchMap {
  key: string,
  title: string,
  type: 'json',
  primary: 1,
  isEditable: 1,
  switchable: 0,
  position: 0,
  isActive: 0,
  value: any,
  json: {
    attributes: {},
    attributesValue: {}
  }
}