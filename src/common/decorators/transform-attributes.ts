import { Cache } from 'cache-manager';

export function TransformAttributes(defaultLang: string, paramLangIndex: number = 1): MethodDecorator {
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const lang = args[paramLangIndex] ?? defaultLang;
      const result = await originalMethod.apply(this, args);

      if (result && result.attributes) {
        const cacheManager: Cache = this.cacheManager;

        const attributes = await cacheManager.get('product_attributes');

        if (attributes) {
          result.attributes = Object.keys(result.attributes)
            .map((key, index) => ({
              name: attributes[key]?.name?.[lang] ?? `Attribute №${index}`,
              type: attributes[key]?.type,
              order: attributes[key]?.order,
              value: result.attributes[key],
            }))
            .sort((a, b) => a.order - b.order);
        }
      }

      return result;
    };

    return descriptor;
  };
}
