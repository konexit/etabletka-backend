import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/products/product/entities/product.entity';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    CategoriesModule
  ],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService, SearchModule],
})
export class SearchModule { }
