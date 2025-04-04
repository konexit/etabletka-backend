import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { CacheKeys } from 'src/settings/refresh/refresh-keys';
import { AppEnv } from '../config/common.constants';

export enum TransformAttributesViews {
  Arr = 'arr',
  Object = 'object',
  Raw = 'raw',
}

export interface TransformAttributesOptions {
  lang?: string,
  paramLangIndex?: number;
  typeViews: TransformAttributesViews;
}

const defaultOptions: TransformAttributesOptions = {
  paramLangIndex: 1,
  typeViews: TransformAttributesViews.Object,
};

const typeObjectView = (): Products.Attributes => ({
  price: {
    denominator: 1,
    wholeName: '',
    partName: '',
  },
  preview: [],
  main: [],
  attributes: [],
});

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
      const attributes = await cacheManager.get(CacheKeys.ProductAttributes);

      const configService: ConfigService = this.configService;
      const denominatorKey = configService.get<string>(AppEnv.ProductPriceDenominatorKey);
      const wholeKey = configService.get<string>(AppEnv.ProductPriceWholeKey);
      const partKey = configService.get<string>(AppEnv.ProductPricePartKey);

      const transformAttributes = (item: any) => {
        if (item.attributes && attributes) {
          switch (options.typeViews) {
            case TransformAttributesViews.Object:
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
              }, typeObjectView());

              if (
                item.attributes[denominatorKey] &&
                item.attributes[wholeKey] &&
                item.attributes[partKey]
              ) {
                prepareResult.price.denominator = +(
                  item.attributes[denominatorKey]?.name?.[lang] ?? 1
                );
                prepareResult.price.wholeName =
                  item.attributes[wholeKey]?.name?.[lang] ?? '';
                prepareResult.price.partName =
                  item.attributes[partKey]?.name?.[lang] ?? '';
              }

              item.attributes = prepareResult;
              break;

            case TransformAttributesViews.Arr:
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
