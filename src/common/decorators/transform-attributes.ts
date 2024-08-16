import { Cache } from 'cache-manager';

enum TypeViews {
  Arr = 'arr',
  Object = 'object',
  Raw = 'raw'
}

const defaultOptions: TransformAttributesOptions = {
  paramLangIndex: 1,
  typeViews: 'object'
}

const initialValueTypeViewsObject = () => ({
  price: {
    denominator: 1,
    wholeName: '',
    partName: ''
  },
  preview: [],
  main: [],
  attributes: []
})

interface TransformAttributesOptions {
  paramLangIndex: number;
  typeViews: TypeViews | string;
}

export function TransformAttributes(defaultLang: string, optionParamIndex: number = 1): MethodDecorator {
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const options = args[optionParamIndex] ?? defaultOptions;
      const lang = args[options.paramLangIndex] ?? defaultLang;
      const result = await originalMethod.apply(this, args);

      if (result && result.attributes) {
        const cacheManager: Cache = this.cacheManager;
        const priceConfig: PriceConfig = this.priceConfig;
        const attributes = await cacheManager.get('product_attributes');
        const attributesValue = await this.cacheManager.get('product_attributes_value');

        switch (options.typeViews) {
          case TypeViews.Object:
            if (attributes && attributesValue) {
              const prepareResult = Object
                .keys(result.attributes)
                .reduce((acc, key) => {
                  result.attributes[key].name = attributesValue[result.attributes[key].slug]?.[lang] ?? result.attributes[key].slug;
                  attributes[key].sectionViews.forEach(view => acc[view].push({
                    name: attributes[key]?.name?.[lang] ?? attributes[key].alias,
                    order: attributes[key]?.order,
                    value: result.attributes[key],
                  }));
                  return acc;
                }, initialValueTypeViewsObject());
              if (result.attributes[priceConfig.denominatorKey] && result.attributes[priceConfig.wholeKey] && result.attributes[priceConfig.partKey]) {
                prepareResult.price.denominator = +result.attributes[priceConfig.denominatorKey].name
                prepareResult.price.wholeName = result.attributes[priceConfig.wholeKey].name
                prepareResult.price.partName = result.attributes[priceConfig.partKey].name
              }
              result.attributes = prepareResult;
            }
            break;
          case TypeViews.Arr:
            if (attributes && attributesValue) {
              result.attributes = Object
                .keys(result.attributes)
                .map((key) => {
                  result.attributes[key].name = attributesValue[result.attributes[key].slug]?.[lang] ?? result.attributes[key].slug;
                  return {
                    name: attributes[key]?.name?.[lang] ?? attributes[key].alias,
                    type: attributes[key]?.type,
                    sectionViews: attributes[key].sectionViews,
                    order: attributes[key]?.order,
                    value: result.attributes[key],
                  }
                })
                .sort((a, b) => a.order - b.order);
            }
            break;
        }
      }

      return result;
    };

    return descriptor;
  };
}
