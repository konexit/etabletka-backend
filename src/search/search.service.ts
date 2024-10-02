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
import { isEmpty } from './utils';
import { CacheKeys } from 'src/refresh/refresh-keys';

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
      sortableAttr: ['name', 'price', 'rating'],
      facetAttr: [],
    },
  };
  private SQL_AND = ' AND ';

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
    const [filters, products] = await Promise.all([this.getFilters(), this.productRepository.query(this.productIndexQuery(lang, productIds))]);
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const attributes = product.attributes;
      if (!attributes) continue;
      filters.forEach(filter => {
        const attr = attributes[filter]
        if (attr) {
          if (Array.isArray(attr)) {
            product[filter] = attr.reduce((acc, attr) => {
              this.setAttributeValue(filter, attr.slug, attr.name[lang]);
              acc.push(attr.slug);
              return acc;
            }, []);
          } else {
            this.setAttributeValue(filter, attr.slug, attr.name[lang]);
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

  getFacetFilters(index: string = 'products'): string[] {
    return this.indexesConfig[index].facetAttr;
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
        `Index '${indexConfig.name}' created with primary key '${indexConfig.primaryKey}', attributes: searchable[${indexConfig.searchableAttr}] filterable[${indexConfig.filterableAttr}] sortable[${indexConfig.sortableAttr}]`,
      );
    } else {
      this.logger.log(
        `Index '${indexConfig.name}' already exists, attributes: searchable[${indexConfig.searchableAttr}] filterable[${indexConfig.filterableAttr}] sortable[${indexConfig.sortableAttr}]`,
      );
    }

    const index = this.client.index(indexConfig.name);
    await index.updateSearchableAttributes(indexConfig.searchableAttr);
    await index.updateFilterableAttributes(indexConfig.filterableAttr);
    await index.updateSortableAttributes(indexConfig.sortableAttr);
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

  async facetSearch(search: SearchDto) {
    return this.createFacetFilters(search, {
      attributesToRetrieve: [
        'id',
        'img',
        'rating',
        'name',
        'price',
      ],
      limit: search.limit,
      offset: search.offset,
      facets: this.getFacetFilters(),
      sort: search.sort
    });
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
  private extractFacetFilters(filters: string): [Search.SelectedCheckboxFilters[], Search.SelectedRangeFilters[]] {
    const result: [Search.SelectedCheckboxFilters[], Search.SelectedRangeFilters[]] = [[], []];
    if (!filters) return result;
    filters.split('/').forEach((param) => {
      const [key, value] = param.split(':');
      if (!key || !value) return;
      const filter = this.parseFilter(key, value);
      if (filter.type === TypeUI.Checkbox) {
        result[0].push(filter as Search.SelectedCheckboxFilters);
      } else {
        result[1].push(filter as Search.SelectedRangeFilters);
      }
    });
    return result;
  }

  private parseFilter(key: string, value: string): Search.SelectedFilters {
    if (value.includes('&')) {
      const [min, max] = value.split('&').map(Number);
      const result = {
        type: TypeUI.Range,
        key,
        max,
        min,
        sql: ''
      };
      if (min && !max) {
        result.sql = `${key} >= ${min}`;
      } else if (max && !min) {
        result.sql = `${key} <= ${max}`;
      } else {
        result.sql = `${key} ${min} TO ${max}`;
      }
      return result;
    } else if (value.includes('_')) {
      const items = value.split('_');
      return {
        type: TypeUI.Checkbox,
        key,
        value: items,
        sql: `${key} IN [${items.map(v => `'${v}'`).join(',')}]`
      };
    } else {
      return {
        type: TypeUI.Checkbox,
        key,
        value: [value],
        sql: `${key} = '${value}'`
      };
    }
  }

  private async createFacetFilters(search: SearchDto, searchParams: SearchParams): Promise<FacetSearchFilterDto> {
    const attributes: Search.Attributes = await this.cacheManager.get(CacheKeys.ProductAttributes);
    const [selectedCheckboxFilters, selectedRangeFilters] = this.extractFacetFilters(search.filter);
    const filterCheckbox = selectedCheckboxFilters.map(f => f.sql).join(this.SQL_AND);
    const filterRange = selectedRangeFilters.map(f => f.sql).join(this.SQL_AND);
    searchParams.filter = [filterCheckbox, filterRange].filter(f => !!f).join(this.SQL_AND);
    const searchQueriesPromises: Promise<SearchResponse>[] = [this.client.index(this.indexesConfig.products.name).search(search.text, searchParams)];

    if (selectedCheckboxFilters.length) {
      const filterRangeAdd = selectedRangeFilters.length ? `${this.SQL_AND} ${filterRange}` : '';
      selectedCheckboxFilters.forEach(filter => {
        searchQueriesPromises.push(this.client.index(this.indexesConfig.products.name).search(search.text, {
          limit: 0,
          facets: searchParams.facets,
          filter: selectedCheckboxFilters.length == 1 ? filterRange : filter.sql + filterRangeAdd
        }));
      });
    }

    if (selectedRangeFilters.length) {
      searchQueriesPromises.push(
        this.client.index(this.indexesConfig.products.name).search(search.text, {
          limit: 0,
          facets: searchParams.facets,
          filter: filterCheckbox
        }));
    }

    const selectedFiltersResults = await Promise.all(searchQueriesPromises);
    const mainSearchQuery = selectedFiltersResults[0];

    if (selectedCheckboxFilters.length) {
      let availableCheckboxFilterValue: Record<string, Search.SelectedCheckboxFacetFilters> = {};

      if (selectedCheckboxFilters.length > 1) {
        availableCheckboxFilterValue = selectedCheckboxFilters.reduce((acc, currentFilter) => {
          acc[currentFilter.key] = selectedCheckboxFilters.reduce((acc, curFilter, i) => {
            const index = i + 1;
            if (curFilter.key == currentFilter.key) return acc;
            if (isEmpty(acc)) {
              acc = selectedFiltersResults[index].facetDistribution[currentFilter.key];
            } else {
              const mergeFilterValue = {};
              const result = selectedFiltersResults[index].facetDistribution[currentFilter.key];
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
        availableCheckboxFilterValue = { [filterKey]: selectedFiltersResults[1].facetDistribution[filterKey] }
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

  private createRangeFilterValues(facetStat: FacetStat, filterAttr: Search.Attribute): Search.FilterRangeValue {
    return {
      alias: filterAttr.key,
      min: facetStat.min,
      max: facetStat.max
    };
  }

  private createCheckboxFilterValues(facetDistribution: CategoriesDistribution, filterAttr: Search.Attribute): Search.FilterCheckBoxValue[] {
    return Object.keys(facetDistribution).map((item) => {
      return {
        name: attributeValue[filterAttr.key][item],
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

  private setAttributeValue(key: string, alias: string, name: string): void {
    const value = attributeValue[key];
    if (!value) {
      attributeValue[key] = { [alias]: name };
    } else {
      value[alias] = name;
    }
  }
}
