import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from './entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';


@Module({
  imports: [TypeOrmModule.forFeature([Category]), CacheModule.register()],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService, CategoriesModule],
})
export class CategoriesModule {}
