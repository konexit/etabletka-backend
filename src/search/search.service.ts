import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MeiliSearch, SearchParams, SearchResponse, CategoriesDistribution, FacetStats } from 'meilisearch';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../product/entities/product.entity';
import { Repository } from 'typeorm';
import { FacetSearchFilterDto, Filter } from './dto/facet-search-filters.dto';
import * as facetSearchMap from './facet-search-map.json'; //todo import from db
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
      /*
        ID  2 - Форма випуску
        ID  3 - Кількість в упаковці
        ID  5 - Первинна упаковка
        ID  6 - Кількість первинних упаковок
        ID 10 - Упаковка
        ID 14 - Розмір
        ID 18 - Відпуск за рецептом 
        ID 19 - Температура зберігання
      */
      filterableAttr: ['sync_id', '2', '3', '5', '6', '10', '14', '18', '19', 'price'], //todo dynamic config this attr
      facetAttr: ['2', '3', '5', '6', '10', '14', '18', '19', 'price'],
    },
  };

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private configService: ConfigService,
  ) {
    this.client = new MeiliSearch({
      host: this.configService.get('MEILISEARCH_HOST'),
      apiKey: this.configService.get('MEILISEARCH_KEY'),
    });
    this.createIndexIfNotExists(this.indexesConfig.products);
    this.makeIndex(this.indexesConfig.products.name);
  }

  async makeIndex(index: string, lang: string = 'uk') {
    let document: Array<any> = [];
    switch (index) {
      case this.indexesConfig.products.name:
        document = await this.makeProductIndex(lang);
        break;
      default:
        throw new HttpException(
          `index '${index}' not supported`,
          HttpStatus.NOT_FOUND,
        );
    }
    return await this.addDocumentsToIndex(document, index);
  }

  async makeProductIndex(lang: string): Promise<Array<any>> {
    const products = await this.productRepository.query(
      `SELECT jsonb_build_object(
        'id', id,
        'sync_id', sync_id,
        'name', name->>'${lang}',
        'isActive', active,
        'img', 'https://etabletka.ua/img/no-photo.png',
        'rating', rating,
        'category_path', attributes->'category_path'->>'path',
        'price', price) || (SELECT json_object_agg(key, value->>'slug') FROM jsonb_each(attributes) AS kv(key, value) WHERE (value->>'filter')::boolean = false
      )::jsonb AS p
      FROM products
      WHERE products.attributes IS NOT NULL`,
    );

    if (!products) {
      throw new HttpException('Products does not exist', HttpStatus.NOT_FOUND);
    }

    const productsToIndex = products.map((product) => product.p);
    this.logger.log(
      `product indexing was successful, count: ${productsToIndex.length}`,
    );
    return productsToIndex;
  }

  async search(text: string, searchParams?: SearchParams) {
    if (!isNaN(Number(text)))
      Object.assign(searchParams, { filter: [`sync_id = ${text}`] });
    return await this.client
      .index(this.indexesConfig.products.name)
      .search(text, searchParams);
  }

  async facetSearch(text: string, searchParams?: SearchParams) {
    return this.createFacetFilters(
      await this.client
        .index(this.indexesConfig.products.name)
        .search(text, searchParams));
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
        `Index "${indexConfig.name}" created with primary key "${indexConfig.primaryKey}", attributes: searcheble[${indexConfig.searchableAttr}] filterable[${indexConfig.filterableAttr}]`,
      );
    } else {
      this.logger.log(
        `Index "${indexConfig.name}" already exists, attributes: searcheble[${indexConfig.searchableAttr}] filterable[${indexConfig.filterableAttr}]`,
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

  private createFacetFilters(res: SearchResponse): FacetSearchFilterDto {
    return {
      filters: Object
        .keys(res.facetDistribution)
        .reduce((acc, key) => {
          if (isEmpty(res.facetDistribution[key])) return acc;
          acc.push(this.createFilter(key, res.facetDistribution[key], res.facetStats));
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

  private createFilter(key: string, values: CategoriesDistribution, facetStats: FacetStats): Filter {
    const filter: Filter = facetSearchMap.filter[key];
    return {
      api: '',
      name: filter.name,
      order: filter.order,
      alias: filter.alias,
      type: filter.type,
      values: filter.type == 'range' ? Object.assign({
        name: facetSearchMap.values[key] ?? key,
        alias: key,
      }, facetStats[key]) : Object
        .keys(values)
        .map((item) => {
          return {
            name: facetSearchMap.values[item] ?? item,
            alias: item,
            count: values[item]
          };
        })
    };
  }
}
