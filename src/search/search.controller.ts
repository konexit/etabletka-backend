import { Body, Controller, Post, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchDto } from './dto/search.dto';
import { FacetSearchFilterDto } from './dto/facet-search-filters.dto';
import { ApiTags } from '@nestjs/swagger';
import { SearchParams, SearchResponse } from 'meilisearch';
import { SearchIndexType } from 'src/common/types/search/search.interface';

@ApiTags('search')
@Controller('api/v1')
export class SearchController {
  constructor(private readonly searchService: SearchService) { }

  @Post('/search')
  async getSearch(@Body() searchDto: SearchDto): Promise<SearchResponse<any, SearchParams & { filter: string[] }>> {
    return this.searchService.search(searchDto);
  }

  @Post('/facet-search')
  async getFacetSearch(@Body() searchDto: SearchDto): Promise<FacetSearchFilterDto> {
    return this.searchService.facetSearch(searchDto);
  }

  @Post('/search/make-index')
  async makeIndex(@Query('name') name?: string) {
    return this.searchService.makeIndex(name ?? SearchIndexType.Products);
  }
}
