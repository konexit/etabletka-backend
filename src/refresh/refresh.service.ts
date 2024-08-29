import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { SiteOptionService } from 'src/siteOptions/site-option.service';
import { CacheKeys, SearchEngineKeys } from './refresh-keys';
import { SearchService } from 'src/search/search.service';
import { SearchEngineRefreshDto } from './dto/search-engine-refresh.dto';

@Injectable()
export class RefreshService {
  private readonly logger = new Logger(RefreshService.name);

  constructor(
    private readonly siteOptionService: SiteOptionService,
    private readonly searchService: SearchService
  ) { }

  async refreshCacheByKey(key: string) {
    switch (key) {
      case CacheKeys.ProductAttributesMap:
        await this.siteOptionService.moveFacetSearchMapToCache();
        break;
      case CacheKeys.ProductAttributes:
        await this.siteOptionService.moveFacetSearchMapToCache(CacheKeys.ProductAttributes);
        break;
      case CacheKeys.ProductAttributesValue:
        await this.siteOptionService.moveFacetSearchMapToCache(CacheKeys.ProductAttributesValue);
        break;
      case CacheKeys.All:
        await this.siteOptionService.moveFacetSearchMapToCache();
        break;
      default:
        const warnMsg = `cache key: '${key}' is not supported, only these [${Object.values(CacheKeys)}]`;
        this.logger.warn(warnMsg);
        throw new HttpException({
          status: 'failed',
          errMessage: warnMsg,
          key
        }, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    this.logger.log(`cache by key: '${key}' updated successfully`);
    return {
      status: 'success',
      errMessage: '',
      key
    };
  }

  async refreshSearchEngine(searchEngineRefresh: SearchEngineRefreshDto) {
    const lang = searchEngineRefresh.lang ?? 'uk';
    const fullReplace = searchEngineRefresh.fullReplace ?? false;
    const primaryKey = searchEngineRefresh.primaryKey ?? 'id';

    switch (searchEngineRefresh.key) {
      case SearchEngineKeys.ProductsAll:
        await this.searchService.makeIndex(
          searchEngineRefresh.index,
          primaryKey
        );
        break;
      case SearchEngineKeys.ProductSome:
        await this.searchService.makePartialIndex(
          searchEngineRefresh.index,
          primaryKey,
          searchEngineRefresh.primaryKeys,
          lang,
          fullReplace
        );
        break;
      case SearchEngineKeys.DeleteSomeDoc:
      case SearchEngineKeys.DeleteAllDoc:
        await this.searchService.deleteDocsByIndex(searchEngineRefresh.index, searchEngineRefresh.primaryKeys);
        break;
      default:
        const warnMsg = `search engine key: '${searchEngineRefresh.key}' is not supported, only these [${Object.values(SearchEngineKeys)}]`;
        this.logger.warn(warnMsg);
        throw new HttpException({
          status: 'failed',
          errMessage: warnMsg,
          key: searchEngineRefresh.key
        }, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    this.logger.log(`search engine by key: '${searchEngineRefresh.key}' updated successfully`);
    return {
      status: 'success',
      errMessage: '',
      key: searchEngineRefresh.key
    };
  }
}
