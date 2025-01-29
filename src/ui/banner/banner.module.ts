import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Banner } from './entities/banner.entity';
import { BannerController } from './banner.controller';
import { BannerService } from './banner.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [TypeOrmModule.forFeature([Banner]), CacheModule.register()],
  controllers: [BannerController],
  providers: [BannerService],
  exports: [BannerService, BannerModule],
})
export class BannerModule {}
