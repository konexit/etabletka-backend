import { Cache } from 'cache-manager';
import { CacheKeys } from 'src/settings/refresh/refresh-keys';

enum TypeViews {
  Arr = 'arr',
  Object = 'object',
  Raw = 'raw',
}

const defaultOptions: TransformAttributesOptions = {
  paramLangIndex: 1,
  typeViews: 'object',
};

const initialValueTypeViewsObject = () => ({
  price: {
    denominator: 1,
    wholeName: '',
    partName: '',
  },
  preview: [],
  main: [],
  attributes: [],
});

export interface TransformAttributesOptions {
  lang?: string,
  paramLangIndex?: number;
  typeViews: TypeViews | string;
}

const getValueByLang = (value: any, lang: string) => {
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      value[i].name = value[i].name[lang];
    }
  } else {
    value.name = value.name[lang];
  }
  return value;
}

export function TransformAttributes(
  defaultLang: string,
  optionParamIndex: number = 1,
): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const options = args[optionParamIndex] ?? defaultOptions;
      const lang = args[options.paramLangIndex] ? args[options.paramLangIndex] : options.lang ?? defaultLang;
      const result = await originalMethod.apply(this, args);

      if (!result) return result;

      const cacheManager: Cache = this.cacheManager;
      const priceConfig: PriceConfig = this.priceConfig;
      const attributes = await cacheManager.get(CacheKeys.ProductAttributes);

      const transformAttributes = (item: any) => {
        if (item.attributes && attributes) {
          switch (options.typeViews) {
            case TypeViews.Object:
              const prepareResult = Object.keys(item.attributes).reduce((acc, key) => {
                const value = getValueByLang(item.attributes[key], lang);
                const attr = attributes[key];

                if (attr) {
                  attr.sectionViews.forEach((view) => {
                    acc[view].push({
                      name: attributes[key]?.name?.[lang],
                      order: attributes[key]?.order,
                      value,
                    });
                  });
                }
                return acc;
              }, initialValueTypeViewsObject());

              if (
                item.attributes[priceConfig.denominatorKey] &&
                item.attributes[priceConfig.wholeKey] &&
                item.attributes[priceConfig.partKey]
              ) {
                prepareResult.price.denominator = +(
                  item.attributes[priceConfig.denominatorKey]?.name?.[lang] ?? 1
                );
                prepareResult.price.wholeName =
                  item.attributes[priceConfig.wholeKey]?.name?.[lang] ?? "";
                prepareResult.price.partName =
                  item.attributes[priceConfig.partKey]?.name?.[lang] ?? "";
              }

              item.attributes = prepareResult;
              break;

            case TypeViews.Arr:
              item.attributes = Object.keys(item.attributes)
                .map((key) => ({
                  name: attributes[key]?.name?.[lang],
                  type: attributes[key]?.type,
                  sectionViews: attributes[key].sectionViews,
                  order: attributes[key]?.order,
                  value: getValueByLang(item.attributes[key], lang),
                }))
                .sort((a, b) => a.order - b.order);
              break;
          }
        }
        return item;
      };

      if (Array.isArray(result)) {
        return result.map(transformAttributes);
      } else {
        return transformAttributes(result);
      }
    };

    return descriptor;
  }
}
