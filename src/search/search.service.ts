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
  FacetStats,
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

  async facetSearch(search: SearchDto, searchParams?: SearchParams) {
    const selectedFilters = this.getSelectedFilters(search.filter);
    const searchQueries = [this.client.index(this.indexesConfig.products.name).search(search.text, searchParams)];
    if (search.filter) {
      let filter = '';
      if (selectedFilters.length > 1) {
        filter = (<string>searchParams.filter).split(` AND ${selectedFilters.pop().key}`)[0];
      }
      searchQueries.push(this.client.index(this.indexesConfig.products.name).search(search.text, {
        facets: searchParams.facets,
        offset: searchParams.offset,
        limit: searchParams.limit,
        filter
      }));
    }
    return await this.createFacetFilters(search.lang, await Promise.all(searchQueries), selectedFilters);
  }

  getSelectedFilters(filters: string): Search.SelectedFilters[] {
    let isTypeRange = false;
    let isFilter = false;
    let currentFilter = '';
    const result: Search.SelectedFilters[] = [];

    const addFilter = () => {
      if (isFilter) {
        result.push({
          key: currentFilter,
          type: isTypeRange ? 'range' : 'checkbox'
        });
        currentFilter = '';
        isTypeRange = isFilter = false;
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
      } else {
        if (!isFilter) {
          currentFilter += char;
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

  private async createFacetFilters(
    lang: string,
    res: SearchResponse[],
    selectedFilters?: Search.SelectedFilters[]
  ): Promise<FacetSearchFilterDto> {
    const attributes: Search.Attributes = (await this.cacheManager.get(CacheKeys.ProductAttributes));
    selectedFilters.forEach(filter => {
      if (filter.type == 'checkbox') {
        Object.assign(res[0].facetDistribution[filter.key], res[1].facetDistribution[filter.key])
      } else {
        res[0].facetStats = res[1].facetStats
      }
    })
    return {
      filters: Object.keys(res[0].facetDistribution)
        .reduce((acc, key) => {
          if (isEmpty(res[0].facetDistribution[key])) return acc;
          acc.push(
            this.createFilter(
              lang,
              key,
              res[0].facetDistribution[key],
              res[0].facetStats,
              attributes,
            ),
          );
          return acc;
        }, [])
        .sort((a, b) => a.order - b.order),
      products: res[0].hits,
      limit: res[0].limit,
      offset: res[0].offset,
      estimatedTotalHits: res[0].estimatedTotalHits,
      query: res[0].query,
    };
  }

  private createFilter(
    lang: string,
    key: string,
    values: CategoriesDistribution,
    facetStats: FacetStats,
    attributes: Search.Attributes,
  ): Filter {
    const filter: Search.Attribute = attributes[key];
    if (!filter) {
      this.logger.warn(
        `facet-filter key '${key}' not found in attributes, maybe it doesn't exist table 'product_attribute'`,
      );
      return new Filter();
    }
    let filterValues: Search.FilterValues = [];

    switch (filter.typeUI) {
      case TypeUI.Checkbox:
        filterValues = Object.keys(values).map((item) => {
          return {
            name: attributeValue[item],
            alias: item,
            count: values[item],
          };
        });
        break;
      case TypeUI.Range:
        filterValues = Object.assign(
          {
            name: attributeValue[key],
            alias: key
          },
          facetStats[key],
        );
        break;
      default:
        this.logger.warn(`facet-filter not support typeUI '${filter.typeUI}'`);
    }

    return {
      name: filter.name[lang],
      order: filter.order,
      alias: filter.key,
      typeUI: filter.typeUI,
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
