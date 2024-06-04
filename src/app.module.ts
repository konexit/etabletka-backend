import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dataSourceOptions } from '../db/data-source';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DiscountModule } from './discount/discount.module';
import { ProductModule } from './product/product.module';
import { ProductRemnantModule } from './productRemnants/productRemnant.module';
import { ProductBadgeModule } from './relations/productBadge/productBadge.module';
import { ProductTypeModule } from './productTypes/productType.module';
import { RegionModule } from './places/region/region.module';
import { CityModule } from './places/city/city.module';
import { CommunityModule } from './places/communitiy/community.module';
import { DistrictModule } from './places/district/district.module';
import { CategoriesModule } from './categories/categories.module';
import { PageModule } from './page/page.module';
import { BannerModule } from './banner/banner.module';
import { BadgeModule } from './badge/badge.module';
import { StoreModule } from './store/store.module';
import { OrderModule } from './order/order.module';
import { MenuModule } from './menu/menu.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.local'],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    BadgeModule,
    BannerModule,
    DiscountModule,
    PageModule,
    ProductModule,
    ProductBadgeModule,
    ProductTypeModule,
    ProductRemnantModule,
    CityModule,
    CommunityModule,
    DistrictModule,
    RegionModule,
    UserModule,
    CategoriesModule,
    StoreModule,
    OrderModule,
    MenuModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
