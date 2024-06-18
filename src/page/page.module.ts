import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Page } from './entities/page.entity';
import { PageController } from './page.controller';
import { PageService } from './page.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [TypeOrmModule.forFeature([Page]), CacheModule.register()],
  controllers: [PageController],
  providers: [PageService],
  exports: [PageService, PageModule],
})
export class PageModule {}
