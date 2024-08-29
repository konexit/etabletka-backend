import { Controller, Delete, Post, Body, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RefreshService } from './refresh.service';
import { SearchEngineRefreshDto } from './dto/search-engine-refresh.dto';

@ApiTags('refresh')
@Controller('api/v1/refresh')
export class RefreshController {
  constructor(private readonly refreshService: RefreshService) { }

  @Post('/cache/:key')
  cache(@Param('key') key: string) {
    return this.refreshService.refreshCacheByKey(key);
  }

  @Post('/search-engine')
  searchEngine(@Body() searchEngineRefresh: SearchEngineRefreshDto) {
    return this.refreshService.refreshSearchEngine(searchEngineRefresh);
  }
}
