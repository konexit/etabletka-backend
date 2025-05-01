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
import { Product } from 'src/products/product/entities/product.entity';
import {
  FacetSearchFilterDto,
  Filter,
  TypeUI,
} from './dto/facet-search-filters.dto';
import {
  SearchIndexConfig,
  SearchIndexType,
  SearchIndexesConfig
} from 'src/common/types/search/search.interface';
import { SearchDto } from './dto/search.dto';
import { groupBy, isEmpty } from './utils';
import { CacheKeys } from 'src/settings/refresh/refresh-keys';
import { TypeSource } from 'src/products/attributes/product-attributes.enum';

// Documentation:  https://www.npmjs.com/package/meilisearch
@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);
  private client: MeiliSearch;
  private indexesConfig: SearchIndexesConfig = {
    products: {
      name: SearchIndexType.Products,
      primaryKey: 'id',
      searchableAttr: ['name', 'sync_id'],
      filterableAttr: ['sync_id', 'active'],
      sortableAttr: ['name', 'price', 'rating'],
      facetAttr: [],
    },
  };
  private SQL_AND = ' AND ';
  private attributeValues: Record<string, string> = {};

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
    await this.searchProductInit();
  }

  async makeIndex(index: string, primaryKey: string = 'id', lang: string = 'uk') {
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
    return fullReplace ? this.updateDocumentsInIndex(document, index, primaryKey) : this.addDocumentsToIndex(document, index, primaryKey);
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
    const [products, attrValues] = await Promise.all([
      this.productRepository.query(this.productIndexQuery(lang, filters, productIds)),
      this.getAttributeValue(productIds)
    ]);

    if (attrValues) {
      for (const filter of filters) {
        if (filter.mergeKeys.length) {
          for (const key of filter.mergeKeys) {
            if (attrValues[key]) {
              Object.assign(attrValues[filter.key] ??= {}, attrValues[key]);
            }
          }
        }
      }

      if (isEmpty(this.attributeValues)) {
        Object.assign(this.attributeValues, attrValues);
      } else {
        for (const key of Object.keys(attrValues)) {
          this.attributeValues[key] = this.attributeValues[key]
            ? Object.assign(this.attributeValues[key], attrValues[key])
            : { ...attrValues[key] };
        }
      }
    }

    this.logger.log(
      `Products indexing was successful, count: ${products.length}, time: ${(performance.now() - start).toFixed(3)} ms`,
    );

    return products;
  }

  async search(searchDto: SearchDto): Promise<SearchResponse<any, SearchParams & { filter: string[] }>> {
    const searchParams: SearchParams & { filter: string[] } = {
      attributesToRetrieve: searchDto.retrieveAttibutes ?? ['*'],
      filter: []
    };

    if (searchDto.active != null || searchDto.active != undefined) {
      searchParams.filter.push(`active = ${searchDto.active}`);
    }

    if (!isNaN(Number(searchDto.text))) {
      searchParams.filter.push(`sync_id = ${searchDto.text}`);
    }

    return this.client
      .index(this.indexesConfig.products.name)
      .search(searchDto.text, searchParams);
  }

  getFacetFilters(index: string = 'products'): string[] {
    return this.indexesConfig[index].facetAttr;
  }

  private async createIndexIfNotExists(indexConfig: SearchIndexConfig) {
    const indexes = await this.client.getIndexes();
    const indexExists = indexes.results.some((index) => index.uid === indexConfig.name);

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
      return this.client.index(index).addDocuments(documents, { primaryKey });
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
      return this.client.index(index).updateDocuments(documents, { primaryKey });
    } catch (error) {
      this.logger.error('Error updating documents:', error);
      throw error;
    }
  }

  async facetSearch(searchDto: SearchDto) {
    return this.createFacetFilters(searchDto, {
      attributesToRetrieve: searchDto.retrieveAttibutes ?? [
        'id',
        'img',
        'rating',
        'name',
        'price',
      ],
      limit: searchDto.limit,
      offset: searchDto.offset,
      facets: this.getFacetFilters(),
      sort: searchDto.sort
    });
  }

  /**
   * Supported filter types:
   * - `range` [key:value1&value2] - separator `&`;
   * - `checkbox` [key:value1_value2_value3] - separator `_`;
   * 
   * All filters can be private, so we need to add an underscore `_` to the beginning of the key
   *  
   * Example: 
   * - [`_key:`value1_value2_value3]
   * 
   * Filter merging template: filter1/filter2/filter... - separator `/`;
   *
   * Example:
   * @param filter price:50&1000/production-form:kapsuly_klipsa_shampun
   */
  private extractFacetFilters(filters: string): [Search.SelectedCheckboxFilters[], Search.SelectedRangeFilters[], Search.PrivateFilters] {
    const result: [Search.SelectedCheckboxFilters[], Search.SelectedRangeFilters[], Search.PrivateFilters] = [[], [], []];
    if (!filters) return result;
    filters.split('/').forEach((param) => {
      const [key, value] = param.split(':');
      if (!key || !value) return;
      const filter = this.parseFilter(key, value);
      if (filter.privateFilter) {
        result[2].push(filter.sql);
        return;
      }
      if (filter.type === TypeUI.Checkbox) {
        result[0].push(filter as Search.SelectedCheckboxFilters);
      } else {
        result[1].push(filter as Search.SelectedRangeFilters);
      }
    });
    return result;
  }

  private parseFilter(key: string, value: string): Search.SelectedFilters {
    const privateFilter = key[0] == '_';
    if (value.includes('&')) {
      const [min, max] = value.split('&').map(Number);
      const result = {
        type: TypeUI.Range,
        key,
        privateFilter,
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
        privateFilter,
        value: items,
        sql: `${key} IN [${items.map(v => `'${v}'`).join(',')}]`
      };
    } else {
      return {
        type: TypeUI.Checkbox,
        key,
        privateFilter,
        value: [value],
        sql: `${key} = '${value}'`
      };
    }
  }

  private async createFacetFilters(search: SearchDto, searchParams: SearchParams): Promise<FacetSearchFilterDto> {
    const attributes: Search.Attributes = await this.cacheManager.get(CacheKeys.ProductAttributes);
    const [selectedCheckboxFilters, selectedRangeFilters, privateFilters] = this.extractFacetFilters(search.filter);
    const filterCheckbox = selectedCheckboxFilters.map(f => f.sql).concat(privateFilters).join(this.SQL_AND);
    const filterRange = selectedRangeFilters.map(f => f.sql).join(this.SQL_AND);
    searchParams.filter = [filterCheckbox, filterRange].filter(f => !!f).join(this.SQL_AND);
    const searchQueriesPromises: Promise<SearchResponse>[] = [this.client.index(this.indexesConfig.products.name).search(search.text, searchParams)];

    if (selectedCheckboxFilters.length) {
      const filterScope = privateFilters.concat(filterRange).filter(f => !!f).join(this.SQL_AND);
      selectedCheckboxFilters.forEach(filter => {
        searchQueriesPromises.push(this.client.index(this.indexesConfig.products.name).search(search.text, {
          limit: 0,
          facets: searchParams.facets,
          filter: selectedCheckboxFilters.length == 1 ? filterScope : `${filter.sql} ${filterScope ? `${this.SQL_AND} ${filterScope}` : ''}`
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

      if (!filterAttr.ui || filterAttr.typeUI == TypeUI.Range) continue;

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

      if (!filterAttr.ui) continue;

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
        name: this.attributeValues[filterAttr.key][item],
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

  private async getFilters(): Promise<Search.FilterAttr[]> {
    return this.productRepository.query(`
      SELECT 
        key,
        multiple_values AS "multipleValues",
        merge_keys AS "mergeKeys",
        type_source AS "typeSource"
      FROM product_attributes 
      WHERE search_engine = true`);
  }

  private productIndexQuery(lang: string, filters: Search.FilterAttr[], productIds?: string[]): string {
    const filterSources = groupBy(filters, f => f.typeSource);
    return `SELECT
                id,
                sync_id,
                name->>'${lang}' AS name,
                active,
                rating
                ${filterSources.get(TypeSource.HEADDER)?.map(f => `,${f.key[0] == '_' ? f.key.slice(1) : f.key} AS "${f.key}"`).join('') ?? ''}
                ${this.productAttributesIndexQuery(filterSources.get(TypeSource.ATTRIBUTES)) ?? []}
            FROM products p
            WHERE search_engine = true ${productIds ? ` AND p.id IN(${productIds.join(',')})` : ''}`;
  }

  private productAttributesIndexQuery(filters: Search.FilterAttr[]): string {
    const slugSQL = (key: string) => `SELECT jsonb_path_query(p.attributes, '$."${key}"[*].slug')`;
    const slugAggSQL = (unique: boolean = false) => `SELECT jsonb_agg(${unique ? 'DISTINCT' : ''} slug)`;
    return filters.map(f => {
      if (f.mergeKeys.length) {
        return `,(${slugAggSQL(true)} AS "${f.key}" FROM (${[...f.mergeKeys, f.key].map(key => `${slugSQL(key)} AS slug`).join(' UNION ALL ')})) AS "${f.key}"`;
      } else {
        if (f.multipleValues) {
          return `,(${slugAggSQL()} FROM (${slugSQL(f.key)} AS slug)) AS "${f.key}"`;
        } else {
          return `,(${slugSQL(f.key)}) AS "${f.key}"`;
        }
      }
    }).join('');
  }

  private async getAttributeValue(productIds?: string[]) {
    const productIdsSQL = productIds ? ` AND id IN(${productIds.join(',')})` : '';
    const attributeValueSQL = `
      SELECT jsonb_object_agg(key, value) AS attrs
      FROM (
          SELECT key,
                jsonb_object_agg(elem->>'slug', elem->'name'->>'uk') AS value
          FROM products p,
              jsonb_each(p.attributes) AS attr(key, val),
              jsonb_array_elements(val) AS elem
          WHERE jsonb_typeof(val) = 'array'
            AND elem->>'slug' IS NOT NULL
            AND elem->'name'->>'uk' IS NOT NULL ${productIdsSQL}
          GROUP BY key
          UNION ALL
          SELECT key,
                jsonb_object_agg(val->>'slug', val->'name'->>'uk') AS value
          FROM products p,
              jsonb_each(p.attributes) AS attr(key, val)
          WHERE jsonb_typeof(val) = 'object'
            AND val->>'slug' IS NOT NULL
            AND val->'name'->>'uk' IS NOT NULL ${productIdsSQL}
          GROUP BY key
      )`;

    const [{ attrs }] = await this.productRepository.query(attributeValueSQL);
    return attrs;
  }

  private async searchProductInit(): Promise<void> {
    const filters = await this.getFilters();
    const filterKeys = filters.map(({ key }) => key);
    this.indexesConfig.products.facetAttr = filterKeys;
    this.indexesConfig.products.filterableAttr = filterKeys.concat(
      this.indexesConfig.products.filterableAttr,
    );
    await this.createIndexIfNotExists(this.indexesConfig.products);
    await this.makeIndex(this.indexesConfig.products.name);
  }
}
