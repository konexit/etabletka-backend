import { Body, Controller, Post, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchDto } from './dto/search.dto';

@Controller('api/v1')
export class SearchController {
  constructor(private readonly searchService: SearchService) { }

  @Post('/search')
  async getSearch(@Body() search: SearchDto) {
    return this.searchService.search(search.text, {
      attributesToRetrieve: ['*'],
    });
  }

  @Post('/search/make-index')
  async makeIndex(
    @Query('name') name?: string,
  ) {
    return await this.searchService.makeIndex(name ?? 'products');
  }
}
