import { Module } from '@nestjs/common';
import { RefreshService } from './refresh.service';
import { RefreshController } from './refresh.controller';
import { SearchModule } from 'src/search/search.module';
import { ProductAttributesModule } from 'src/productAttributes/product-attributes.module';

@Module({
  imports: [ProductAttributesModule, SearchModule],
  controllers: [RefreshController],
  providers: [RefreshService],
  exports: [RefreshService, RefreshModule],
})
export class RefreshModule {}
