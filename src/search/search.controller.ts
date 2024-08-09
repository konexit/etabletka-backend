import { Body, Controller, Post, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchDto } from './dto/search.dto';
import { FacetSearchFilterDto } from './dto/facet-search-filters.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('search')
@Controller('api/v1')
export class SearchController {
  constructor(private readonly searchService: SearchService) { }

  @Post('/search')
  async getSearch(@Body() search: SearchDto) {
    return this.searchService.search(search.text, {
      attributesToRetrieve: ['*'],
    });
  }

  @Post('/facet-search')
  async getFacetSearch(
    @Body() search: SearchDto,
  ): Promise<FacetSearchFilterDto> {
    return this.searchService.facetSearch(search, {
      attributesToRetrieve: [
        'id',
        'img',
        'rating',
        'name',
        'category_path',
        'price',
      ],
      limit: search.limit,
      offset: search.offset,
      facets: this.searchService.getFacetFilters(),
      filter: this.searchService.extractFacetFilter(search.filter),
    });
  }

  @Post('/search/make-index')
  async makeIndex(@Query('name') name?: string) {
    return await this.searchService.makeIndex(name ?? 'products');
  }
}
