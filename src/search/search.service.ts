import { MeiliSearch, SearchParams, SearchResponse, CategoriesDistribution, FacetStats } from 'meilisearch';
import { HttpException, HttpStatus, Injectable, Logger, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../product/entities/product.entity';
import { FacetSearchFilterDto, Filter, TypeUI } from './dto/facet-search-filters.dto';
import { SearchDto } from './dto/search.dto';
import { isEmpty } from './utils';
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
    const filterUI = (await this.getFilters('filterUI'));
    this.indexesConfig.products.facetAttr = filterUI;
    this.indexesConfig.products.filterableAttr = filterUI.concat(this.indexesConfig.products.filterableAttr);
    this.createIndexIfNotExists(this.indexesConfig.products);
    this.makeIndex(this.indexesConfig.products.name);
  }

  async makeIndex(index: string, lang: string = 'uk') {
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
    return await this.addDocumentsToIndex(document, index);
  }

  async makeProductsIndex(lang: string): Promise<Array<any>> {
    const start = performance.now()
    const products = await this.productRepository.query(this.productIndexQuery(lang, await this.getFilters()));
    if (!products) {
      throw new HttpException('Products does not exist', HttpStatus.NOT_FOUND);
    }
    this.logger.log(
      `products indexing was successful, count: ${products.length} time: ${(performance.now() - start).toFixed(3)} ms `
    );
    return products;
  }

  async search(text: string, searchParams?: SearchParams) {
    if (!isNaN(Number(text)))
      Object.assign(searchParams, { filter: [`sync_id = ${text}`] });
    return await this.client
      .index(this.indexesConfig.products.name)
      .search(text, searchParams);
  }

  async facetSearch(search: SearchDto, searchParams?: SearchParams) {
    return await this.createFacetFilters(search.lang,
      await this.client
        .index(this.indexesConfig.products.name)
        .search(search.text, searchParams));
  }

  getFacetFilter(index: string = 'products'): string[] {
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
  ): Promise<any> {
    try {
      return await this.client.index(index).addDocuments(documents);
    } catch (error) {
      this.logger.error('Error adding documents:', error);
      throw error;
    }
  }

  private async createFacetFilters(lang: string, res: SearchResponse): Promise<FacetSearchFilterDto> {
    const facetSearchMap: Search.FacetSearchMap = {
      attributes: await this.cacheManager.get('product_attributes') ?? {},
      attributesValue: await this.cacheManager.get('product_attributes_value') ?? {}
    };
    return {
      filters: Object
        .keys(res.facetDistribution)
        .reduce((acc, key) => {
          if (isEmpty(res.facetDistribution[key])) return acc;
          acc.push(this.createFilter(lang, key, res.facetDistribution[key], res.facetStats, facetSearchMap));
          return acc;
        }, [])
        .sort((a, b) => a.order - b.order),
      products: res.hits,
      limit: res.limit,
      offset: res.offset,
      estimatedTotalHits: res.estimatedTotalHits,
      query: res.query
    };
  }

  private createFilter(lang: string, key: string, values: CategoriesDistribution, facetStats: FacetStats, facetSearchMap: Search.FacetSearchMap): Filter {
    const filter: Filter = facetSearchMap.attributes[key];
    if (!filter) {
      this.logger.warn(
        `facet-filter key '${key}' not found in facetSearchMap, may be problems importing it from db table 'site_options'`,
      );
      return new Filter();
    }
    let filterValues: Search.FilterValues = [];

    switch (filter.typeUI) {
      case TypeUI.Checkbox:
        filterValues = Object
          .keys(values)
          .map((item) => {
            return {
              name: this.getFilterValueName(lang, item, facetSearchMap),
              alias: item,
              count: values[item]
            };
          })
        break;
      case TypeUI.Range:
        filterValues = Object
          .assign({
            name: this.getFilterValueName(lang, key, facetSearchMap),
            alias: key,
          }, facetStats[key])
        break;
      default:
        this.logger.warn(
          `facet-filter not support typeUI '${filter.typeUI}'`,
        );
    }

    return {
      api: 'https://etabletka.ua', //todo migrate to .env
      name: filter.name[lang] ?? filter.alias,
      order: filter.order,
      alias: filter.alias,
      typeUI: filter.typeUI,
      values: filterValues
    };
  }

  private getFilterValueName(lang: string, key: string, facetSearchMap: Search.FacetSearchMap): string {
    return (facetSearchMap.attributesValue[key] && facetSearchMap.attributesValue[key][lang]) ?? key;
  }

  private async getFilters(typeFilter: string = 'filter'): Promise<string[]> {
    return (await this.productRepository
      .query(`SELECT key
              FROM jsonb_each((SELECT json->'attributes' FROM site_options WHERE key = 'product_attributes_map')) AS kv(key, value) 
              WHERE (value->'${typeFilter}')::boolean = true`
      ))
      .map(f => f.key);
  }

  private productIndexQuery(lang: string, filters: string[], productId?: number): string {
    return `SELECT
                id,
                sync_id,
                name->>'${lang}' as name,
                rating,
                attributes->'category_path'->>'path' as category_path,
                price
                ${filters.map(f => `,attributes->'${f}'->>'slug' as "${f}"`).join('')}
            FROM products p
            WHERE p.attributes IS NOT NULL AND p.active = true ${productId ? `AND p.id = ${productId}` : ''}`
  }
}
