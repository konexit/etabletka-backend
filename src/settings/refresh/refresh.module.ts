import { Module } from '@nestjs/common';
import { RefreshService } from './refresh.service';
import { RefreshController } from './refresh.controller';
import { SearchModule } from 'src/search/search.module';
import { ProductAttributesModule } from 'src/products/attributes/product-attributes.module';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  imports: [ProductAttributesModule, SearchModule, CategoriesModule],
  controllers: [RefreshController],
  providers: [RefreshService],
  exports: [RefreshService, RefreshModule],
})
export class RefreshModule {}
