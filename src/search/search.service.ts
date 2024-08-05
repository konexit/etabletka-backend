import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MeiliSearch, SearchParams } from 'meilisearch';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../product/entities/product.entity';
import { Repository } from 'typeorm';

// Documentation:  https://www.npmjs.com/package/meilisearch
@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);
  private client: MeiliSearch;
  private productIndex = 'products';

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private configService: ConfigService,
  ) {
    this.client = new MeiliSearch({
      host: this.configService.get('MEILISEARCH_HOST'),
      apiKey: this.configService.get('MEILISEARCH_KEY'),
    });
    this.createIndexIfNotExists(
      this.productIndex,
      'id',
      ['name', 'sync_id'],
      ['sync_id'],
    );
    this.makeIndex(this.productIndex);
  }

  async makeIndex(index: string, lang: string = 'uk') {
    let document: Array<any> = [];
    switch (index) {
      case this.productIndex:
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
        'price', price) || (SELECT json_object_agg(key, value->>'slug') FROM jsonb_each(attributes) AS kv(key, value) WHERE (value->>'filter')::boolean = false
      )::jsonb AS p
      FROM products
      WHERE products.attributes IS NOT NULL`,
    );

    if (!products) {
      throw new HttpException(
        'Product with this syncId does not exist',
        HttpStatus.NOT_FOUND,
      );
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
      .index(this.productIndex)
      .search(text, searchParams);
  }

  private async createIndexIfNotExists(
    indexName: string,
    primaryKey: string,
    searchableAttr: string[],
    filterableAttr: string[],
  ) {
    const indexes = await this.client.getIndexes();
    const indexExists = indexes.results.some(
      (index) => index.uid === indexName,
    );

    if (!indexExists) {
      await this.client.createIndex(indexName, { primaryKey });
      this.logger.log(
        `Index "${indexName}" created with primary key "${primaryKey}", attributes: searcheble[${searchableAttr}] filterable[${filterableAttr}]`,
      );
    } else {
      this.logger.log(
        `Index "${indexName}" already exists, attributes: searcheble[${searchableAttr}] filterable[${filterableAttr}]`,
      );
    }
    const index = this.client.index(indexName);
    await index.updateSearchableAttributes(searchableAttr);
    await index.updateFilterableAttributes(filterableAttr);
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
}
