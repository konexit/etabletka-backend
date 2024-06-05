import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteOption } from './entities/siteOption.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { SiteOptionController } from './siteOption.controller';
import { SiteOptionService } from './siteOption.service';

@Module({
  imports: [TypeOrmModule.forFeature([SiteOption]), CacheModule.register()],
  controllers: [SiteOptionController],
  providers: [SiteOptionService],
  exports: [SiteOptionService, SiteOptionModule],
})
export class SiteOptionModule {}
