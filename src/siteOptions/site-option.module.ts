import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteOption } from './entities/site-option.entity';
import { SiteOptionController } from './site-option.controller';
import { SiteOptionService } from './site-option.service';

@Module({
  imports: [TypeOrmModule.forFeature([SiteOption])],
  controllers: [SiteOptionController],
  providers: [SiteOptionService],
  exports: [SiteOptionService, SiteOptionModule],
})
export class SiteOptionModule {}
