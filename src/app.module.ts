import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dataSourceOptions } from '../db/data-source';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DiscountGroupModule } from './discountGroup/discount-group.module';
import { DiscountModule } from './discount/discount.module';
import { ProductModule } from './product/product.module';
import { ProductRemnantModule } from './productRemnants/product-remnant.module';
import { ProductTypeModule } from './productTypes/product-type.module';
import { AnotherPointModule } from './anotherPoint/another-point.module';
import { RegionModule } from './places/region/region.module';
import { CityModule } from './places/city/city.module';
import { CommunityModule } from './places/communitiy/community.module';
import { DistrictModule } from './places/district/district.module';
import { CategoriesModule } from './categories/categories.module';
import { PageModule } from './page/page.module';
import { FaqItemModule } from './page/faqItem/faq-item.module';
import { BannerModule } from './banner/banner.module';
import { BadgeModule } from './badge/badge.module';
import { StoreModule } from './store/store.module';
import { OrderModule } from './order/order.module';
import { MenuModule } from './menu/menu.module';
import { SiteOptionModule } from './siteOptions/site-option.module';
import { RoleModule } from './role/role.module';
import { UserProfileModule } from './userProfile/user-profile.module';
import { BrandsModule } from './brands/brands.module';
import { BlogCategoryModule } from './blogCategoty/blog-category.module';
import { BlogPostModule } from './blogPost/blog-post.module';
import { BlogCommentModule } from './blogComment/blog-comment.module';
import { StoreBrandModule } from './storeBrand/store-brand.module';
import { SellTypeModule } from './sellType/sell-type.module';
import { SearchModule } from './search/search.module';
import { ProductGroupModule } from './productGroup/product-group.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        '.env',
        '.env.local',
        '/var/www/etabletka.ua/api/dist/src/.env',
      ],
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 0
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    BadgeModule,
    BannerModule,
    DiscountGroupModule,
    DiscountModule,
    FaqItemModule,
    PageModule,
    ProductModule,
    ProductTypeModule,
    ProductRemnantModule,
    ProductGroupModule,
    CityModule,
    AnotherPointModule,
    CommunityModule,
    DistrictModule,
    RegionModule,
    RoleModule,
    UserModule,
    UserProfileModule,
    CategoriesModule,
    StoreBrandModule,
    StoreModule,
    OrderModule,
    MenuModule,
    SiteOptionModule,
    BrandsModule,
    BlogCategoryModule,
    BlogPostModule,
    BlogCommentModule,
    SellTypeModule,
    SearchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
