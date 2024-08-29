import { Module } from '@nestjs/common';
import { RefreshService } from './refresh.service';
import { RefreshController } from './refresh.controller';
import { SiteOptionModule } from 'src/siteOptions/site-option.module';
import { SearchModule } from 'src/search/search.module';

@Module({
  imports: [SiteOptionModule, SearchModule],
  controllers: [RefreshController],
  providers: [RefreshService],
  exports: [RefreshService, RefreshModule],
})
export class RefreshModule {}
