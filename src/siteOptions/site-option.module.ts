import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteOption } from './entities/site-option.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { SiteOptionController } from './site-option.controller';
import { SiteOptionService } from './site-option.service';

@Module({
  imports: [TypeOrmModule.forFeature([SiteOption]), CacheModule.register()],
  controllers: [SiteOptionController],
  providers: [SiteOptionService],
  exports: [SiteOptionService, SiteOptionModule],
})
export class SiteOptionModule {}
