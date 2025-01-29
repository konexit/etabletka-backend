import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dataSourceOptions } from '../db/data-source';
import { UserModule } from 'src/users/user/user.module';
import { AuthModule } from './auth/auth.module';
import { DiscountGroupModule } from './discountGroup/discount-group.module';
import { DiscountModule } from './discount/discount.module';
import { ProductModule } from './product/product.module';
import { ProductRemnantModule } from './productRemnants/product-remnant.module';
import { ProductTypeModule } from './productTypes/product-type.module';
import { AnotherPointModule } from './anotherPoint/another-point.module';
import { RegionModule } from './katottg/region/region.module';
import { CityModule } from './katottg/city/city.module';
import { CommunityModule } from './katottg/communitiy/community.module';
import { DistrictModule } from './katottg/district/district.module';
import { CategoriesModule } from './categories/categories.module';
import { PageModule } from './page/page.module';
import { FaqItemModule } from './page/faqItem/faq-item.module';
import { BannerModule } from './banner/banner.module';
import { BadgeModule } from './badge/badge.module';
import { StoreModule } from 'src/stores/store/store.module';
import { MenuModule } from './menu/menu.module';
import { SiteOptionModule } from './siteOptions/site-option.module';
import { RoleModule } from 'src/users/role/user-role.module';
import { UserProfileModule } from 'src/users/profile/user-profile.module';
import { BrandsModule } from './brands/brands.module';
import { BlogCategoryModule } from './BLOGCATEGORY/blog-category.module';
import { BlogPostModule } from './blogPost/blog-post.module';
import { BlogCommentModule } from './blogComment/blog-comment.module';
import { StoreBrandModule } from 'src/stores/brand/store-brand.module';
import { SellTypeModule } from './sellType/sell-type.module';
import { SearchModule } from './search/search.module';
import { ProductGroupModule } from './productGroup/product-group.module';
import { ProductCommentModule } from './productComment/product-comment.module';
import { RefreshModule } from './refresh/refresh.module';
import { WsModule } from './infrastructure/ws/ws.module';
import { ProductAttributesModule } from './productAttributes/product-attributes.module';
import { CartModule } from './commerce/cart/cart.module';
import { OrderModule } from './commerce/order/order.module';
import { TradeModule } from './providers/trade/trade.module';
import { CDNModule } from './providers/cdn/cdn.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        '.env',
      ],
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 0,
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
    ProductCommentModule,
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
    MenuModule,
    SiteOptionModule,
    BrandsModule,
    BlogCategoryModule,
    BlogPostModule,
    BlogCommentModule,
    SellTypeModule,
    SearchModule,
    RefreshModule,
    WsModule,
    ProductAttributesModule,
    CartModule,
    OrderModule,
    TradeModule,
    CDNModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
