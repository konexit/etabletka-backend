import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import {
  CategoriesDistribution,
  FacetStat,
  MeiliSearch,
  SearchParams,
  SearchResponse,
} from 'meilisearch';
import { Repository } from 'typeorm';
import { Product } from '../product/entities/product.entity';
import {
  FacetSearchFilterDto,
  Filter,
  TypeUI,
} from './dto/facet-search-filters.dto';
import { SearchDto } from './dto/search.dto';
import { groupBy, isEmpty } from './utils';
import { CacheKeys } from 'src/refresh/refresh-keys';
import { filter } from 'rxjs';

const attributeValue = {};
// Documentation:  https://www.npmjs.com/package/meilisearch
@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);
  private client: MeiliSearch;
  private indexesConfig: IndexesConfig = {
    products: {
      name: 'products',
      primaryKey: 'id',
      searchableAttr: ['name', 'sync_id'],
      filterableAttr: ['sync_id'],
      facetAttr: [],
    },
  };

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private configService: ConfigService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {
    this.client = new MeiliSearch({
      host: this.configService.get('MEILISEARCH_HOST'),
      apiKey: this.configService.get('MEILISEARCH_KEY'),
    });
    this.init();
  }

  async init() {
    const filterUI = await this.getFilters('filter_ui');
    this.indexesConfig.products.facetAttr = filterUI;
    this.indexesConfig.products.filterableAttr = filterUI.concat(
      this.indexesConfig.products.filterableAttr,
    );
    this.createIndexIfNotExists(this.indexesConfig.products);
    this.makeIndex(this.indexesConfig.products.name);
  }

  async makeIndex(index: string, primaryKey: string = 'id', lang: string = 'uk',) {
    let document: Array<any> = [];
    switch (index) {
      case this.indexesConfig.products.name:
        document = await this.makeProductsIndex(lang);
        break;
      default:
        throw new HttpException(
          `index '${index}' not supported`,
          HttpStatus.NOT_FOUND,
        );
    }
    return await this.addDocumentsToIndex(document, index, primaryKey);
  }

  async makePartialIndex(
    index: string,
    primaryKey: string = 'id',
    primaryKeys: string[],
    lang: string = 'uk',
    fullReplace: boolean = false) {
    let document: Array<any> = [];
    switch (index) {
      case this.indexesConfig.products.name:
        document = await this.makeProductsIndex(lang, primaryKeys);
        break;
      default:
        throw new HttpException(
          `index '${index}' not supported`,
          HttpStatus.NOT_FOUND,
        );
    }
    return fullReplace ? await this.updateDocumentsInIndex(document, index, primaryKey) : await this.addDocumentsToIndex(document, index, primaryKey);
  }

  async deleteDocsByIndex(index: string, primaryKeys?: string[]) {
    switch (index) {
      case this.indexesConfig.products.name:
        return primaryKeys ? await this.client.index(index).deleteDocuments(primaryKeys) : await this.client.index(index).deleteAllDocuments();
      default:
        throw new HttpException(
          `index '${index}' not supported`,
          HttpStatus.NOT_FOUND,
        );
    }
  }

  async makeProductsIndex(lang: string, productIds?: string[]): Promise<Array<any>> {
    const start = performance.now();
    const filters = await this.getFilters();
    const products = await this.productRepository.query(this.productIndexQuery(lang, productIds));
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const attributes = product.attributes;
      if (!attributes) continue;
      filters.forEach(filter => {
        const attr = attributes[filter]
        if (attr) {
          if (Array.isArray(attr)) {
            product[filter] = attr.reduce((acc, attr) => {
              attributeValue[attr.slug] = attr.name[lang]
              acc.push(attr.slug);
              return acc;
            }, []);
          } else {
            attributeValue[attr.slug] = attr.name[lang]
            product[filter] = [attr.slug];
          }
        }
      });
      delete product.attributes;
    }

    if (!products) {
      throw new HttpException('Products does not exist', HttpStatus.NOT_FOUND);
    }
    this.logger.log(
      `products indexing was successful, count: ${products.length} time: ${(performance.now() - start).toFixed(3)} ms `,
    );
    return products;
  }

  async search(text: string, searchParams?: SearchParams) {
    if (!isNaN(Number(text))) {
      Object.assign(searchParams, { filter: [`sync_id = ${text}`] });
    }
    return await this.client
      .index(this.indexesConfig.products.name)
      .search(text, searchParams);
  }

  getSelectedFilters(filters: string): [Search.SelectedCheckboxFilters[], Search.SelectedRangeFilters[]] {
    let isTypeRange = false;
    let isFilter = false;
    let currentFilter = '';
    let currentValue = '';
    let min = '';
    let value = [];
    const result: [Search.SelectedCheckboxFilters[], Search.SelectedRangeFilters[]] = [[], []];

    const addFilter = () => {
      if (isFilter) {
        if (currentValue) {
          value.push(currentValue);
        }

        if (isTypeRange) {
          result[1].push({
            key: currentFilter,
            type: 'range',
            min: +min,
            max: +currentValue
          });
        } else {
          result[0].push({
            key: currentFilter,
            type: 'checkbox',
            value
          });
        }

        currentFilter = currentValue = min = '';
        isTypeRange = isFilter = false;
        value = [];
      }
    };

    for (let i = 0; i < filters.length; i++) {
      const char = filters[i];
      if (char === '/') {
        addFilter();
      } else if (char === ':') {
        isFilter = true;
      } else if (char === '&') {
        isTypeRange = true;
        min = currentValue;
        currentValue = '';
      } else if (char === '_') {
        value.push(currentValue);
        currentValue = '';
      } else {
        if (!isFilter) {
          currentFilter += char;
        } else {
          currentValue += char;
        }
      }
    }
    addFilter();
    return result;
  }

  getFacetFilters(index: string = 'products'): string[] {
    return this.indexesConfig[index].facetAttr;
  }

  /**
   * Supported filter types:
   * - `range` [key:value1&value2] - separator `&`;
   * - `checkbox` [key:value1_value2_value3] - separator `_`;
   *
   * Filter merging template: filter1/filter2/filter... - separator `/`;
   *
   * Example:
   * @param filter price:50&1000/production-form:kapsuly_klipsa_shampun
   */
  extractFacetFilter(filter: string): string {
    if (!filter) return '';
    const sqlParts = [];
    filter.split('/').forEach((param) => {
      const [key, value] = param.split(':');
      if (!key || !value) return;
      sqlParts.push(this.buildSQL(key, value));
    });
    if (!sqlParts.length) return '';
    return sqlParts.join(' AND ');
  }

  private async createIndexIfNotExists(indexConfig: IndexConfig) {
    const indexes = await this.client.getIndexes();
    const indexExists = indexes.results.some(
      (index) => index.uid === indexConfig.name,
    );

    if (!indexExists) {
      await this.client.createIndex(indexConfig.name, {
        primaryKey: indexConfig.primaryKey,
      });
      this.logger.log(
        `Index '${indexConfig.name}' created with primary key '${indexConfig.primaryKey}', attributes: searchable[${indexConfig.searchableAttr}] filterable[${indexConfig.filterableAttr}]`,
      );
    } else {
      this.logger.log(
        `Index '${indexConfig.name}' already exists, attributes: searchable[${indexConfig.searchableAttr}] filterable[${indexConfig.filterableAttr}]`,
      );
    }
    const index = this.client.index(indexConfig.name);
    await index.updateSearchableAttributes(indexConfig.searchableAttr);
    await index.updateFilterableAttributes(indexConfig.filterableAttr);
  }

  private async addDocumentsToIndex(
    documents: Array<any>,
    index: string,
    primaryKey: string
  ): Promise<any> {
    try {
      return await this.client.index(index).addDocuments(documents, { primaryKey });
    } catch (error) {
      this.logger.error('Error adding documents:', error);
      throw error;
    }
  }

  private async updateDocumentsInIndex(
    documents: Array<any>,
    index: string,
    primaryKey: string
  ): Promise<any> {
    try {
      return await this.client.index(index).updateDocuments(documents, { primaryKey });
    } catch (error) {
      this.logger.error('Error updating documents:', error);
      throw error;
    }
  }

  async facetSearch(search: SearchDto, searchParams: SearchParams) {
    return this.createFacetFilters(search, searchParams);
  }

  private async createFacetFilters(search: SearchDto, searchParams: SearchParams): Promise<FacetSearchFilterDto> {
    const searchQueriesPromises: Promise<SearchResponse>[] = [];
    const attributes: Search.Attributes = (await this.cacheManager.get(CacheKeys.ProductAttributes));
    const mainSearchQuery = await this.client.index(this.indexesConfig.products.name).search(search.text, searchParams);
    const [selectedCheckboxFilters, selectedRangeFilters] = this.getSelectedFilters(search.filter);
    const filterRange = selectedRangeFilters.length ? ` AND ${selectedRangeFilters.map(({ key, min, max }) => `${key} ${min} TO ${max}`).join(' AND')}` : '';

    if (selectedCheckboxFilters.length) {
      selectedCheckboxFilters.forEach(filter => {
        searchQueriesPromises.push(this.client.index(this.indexesConfig.products.name).search(search.text, {
          limit: 0,
          facets: searchParams.facets,
          filter: selectedCheckboxFilters.length == 1 ? '' : `${filter.key} IN [${filter.value.join(',')}] ${filterRange}`
        }));
      });
    }

    if (selectedRangeFilters.length) {
      searchQueriesPromises.push(
        this.client.index(this.indexesConfig.products.name).search(search.text, {
          limit: 0,
          facets: searchParams.facets,
        }));
    }

    const selectedFiltersResults = await Promise.all(searchQueriesPromises);

    if (selectedCheckboxFilters.length) {
      let availableCheckboxFilterValue: Record<string, Search.SelectedCheckboxFacetFilters> = {};

      if (selectedCheckboxFilters.length > 1) {
        availableCheckboxFilterValue = selectedCheckboxFilters.reduce((acc, currentFilter) => {
          acc[currentFilter.key] = selectedCheckboxFilters.reduce((acc, curFilter, i) => {
            if (curFilter.key == currentFilter.key) return acc;
            if (isEmpty(acc)) {
              acc = selectedFiltersResults[i].facetDistribution[currentFilter.key];
            } else {
              const mergeFilterValue = {};
              const result = selectedFiltersResults[i].facetDistribution[currentFilter.key];
              for (const filterValue in result) {
                if (acc[filterValue]) {
                  mergeFilterValue[filterValue] = result[filterValue] < acc[filterValue] ? result[filterValue] : acc[filterValue];
                }
              }
              acc = mergeFilterValue;
            }
            return acc;
          }, {});
          return acc;
        }, {});
      } else {
        const filterKey = selectedCheckboxFilters[0].key;
        availableCheckboxFilterValue = { [filterKey]: selectedFiltersResults[0].facetDistribution[filterKey] }
      }

      selectedCheckboxFilters.forEach(filter => {
        const f = availableCheckboxFilterValue[filter.key]
        filter.value.forEach(value => {
          if (!f[value]) {
            f[value] = 0;
          }
        });
        Object.assign(mainSearchQuery.facetDistribution[filter.key], f);
      });
    }

    if (selectedRangeFilters.length) {
      const rangeQuery = selectedFiltersResults[selectedFiltersResults.length - 1];
      selectedRangeFilters.forEach(({ key }) => {
        let facetStat = rangeQuery.facetStats[key];
        if (!facetStat) {
          facetStat = {
            min: 0,
            max: 0
          };
        }
        if (!mainSearchQuery.facetStats[key]) {
          mainSearchQuery.facetStats[key] = facetStat;
        } else {
          Object.assign(mainSearchQuery.facetStats[key], facetStat);
        }
      })
    }

    const filtersWarn: string[] = [];
    const filters: Filter[] = [];

    const checkBoxFilters: Filter[] = [];
    for (const key in mainSearchQuery.facetDistribution) {
      const filterAttr: Search.Attribute = attributes[key];
      if (!filterAttr) {
        filtersWarn.push(key);
        continue;
      }

      if (!filterAttr.filterUI || filterAttr.typeUI == TypeUI.Range) continue;

      checkBoxFilters.push(
        this.createFilter(
          search.lang,
          filterAttr,
          this.createCheckboxFilterValues(mainSearchQuery.facetDistribution[key], filterAttr)
        ));
    }

    const rangeFilters: Filter[] = [];
    for (const key in mainSearchQuery.facetStats) {
      const filterAttr: Search.Attribute = attributes[key];
      if (!filterAttr) {
        filtersWarn.push(key);
        continue;
      }

      if (!filterAttr.filterUI) continue;

      rangeFilters.push(
        this.createFilter(
          search.lang,
          filterAttr,
          this.createRangeFilterValues(mainSearchQuery.facetStats[key], filterAttr)
        ));
    }

    if (filtersWarn.length) {
      this.logger.warn(
        `facet-filter keys: [${filtersWarn.join(',')}] not found in attributes, maybe it doesn't exist table 'product_attribute'`,
      );
    }

    return {
      filters: filters.concat(checkBoxFilters, rangeFilters).sort((a, b) => a.order - b.order),
      products: mainSearchQuery.hits,
      limit: mainSearchQuery.limit,
      offset: mainSearchQuery.offset,
      estimatedTotalHits: mainSearchQuery.estimatedTotalHits,
      query: mainSearchQuery.query,
    };
  }

  private createRangeFilterValues(facetStat: FacetStat, filterAttr: Search.Attribute): Search.FilterValues {
    return {
      name: attributeValue[filterAttr.key],
      alias: filterAttr.key,
      min: facetStat.min,
      max: facetStat.max
    };
  }

  private createCheckboxFilterValues(facetDistribution: CategoriesDistribution, filterAttr: Search.Attribute): Search.FilterValues {
    return Object.keys(facetDistribution).map((item) => {
      return {
        name: attributeValue[item],
        alias: item,
        count: facetDistribution[item],
      };
    });
  }

  private createFilter(lang: string, filterAttr: Search.Attribute, filterValues: Search.FilterValues): Filter {
    return {
      name: filterAttr.name[lang],
      order: filterAttr.order,
      alias: filterAttr.key,
      typeUI: filterAttr.typeUI,
      values: filterValues,
    };
  }

  private async getFilters(typeFilter: string = 'filter'): Promise<string[]> {
    return (await this.productRepository.query(`SELECT key FROM product_attributes WHERE ${typeFilter} = true`)).map(({ key }) => key);
  }

  private productIndexQuery(lang: string, productIds?: string[]): string {
    return `SELECT
                id,
                sync_id,
                name->>'${lang}' as name,
                rating,
                cdn_data,
                slug,
                active,
                price,
                attributes
            FROM products p ${productIds ? `WHERE p.id IN(${productIds.join(',')})` : ''}`;
  }

  private buildSQL(key: string, value: string): string {
    if (value.includes('&')) {
      const [min, max] = value.split('&').map(Number);
      return `${key} ${min} TO ${max}`;
    } else if (value.includes('_')) {
      const items = value.split('_').map((v) => `'${v}'`);
      return `${key} IN [${items.join(',')}]`;
    } else {
      return `${key} = '${value}'`;
    }
  }
}
