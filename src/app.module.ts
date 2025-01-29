import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dataSourceOptions } from '../db/data-source';
import { UserModule } from 'src/users/user/user.module';
import { AuthModule } from './auth/auth.module';
import { DiscountGroupModule } from './promo/discount-group/discount-group.module';
import { DiscountModule } from './promo/discount/discount.module';
import { ProductModule } from './products/product/product.module';
import { ProductRemnantModule } from './products/remnants/product-remnant.module';
import { ProductTypeModule } from './products/types/product-type.module';
import { AnotherPointModule } from './settings/another-point/another-point.module';
import { RegionModule } from './katottg/region/region.module';
import { CityModule } from './katottg/city/city.module';
import { CommunityModule } from './katottg/communitiy/community.module';
import { DistrictModule } from './katottg/district/district.module';
import { CategoriesModule } from './categories/categories.module';
import { PageModule } from './ui/pages/page/page.module';
import { FaqItemModule } from './ui/pages/page/faq-item/faq-item.module';
import { BannerModule } from 'src/ui/banner/banner.module';
import { BadgeModule } from './products/badge/badge.module';
import { StoreModule } from 'src/stores/store/store.module';
import { MenuModule } from './ui/menu/menu.module';
import { SiteOptionModule } from './settings/site-options/site-option.module';
import { RoleModule } from 'src/users/role/user-role.module';
import { UserProfileModule } from 'src/users/profile/user-profile.module';
import { BrandsModule } from './brands/brands.module';
import { BlogCategoryModule } from './ui/pages/blogs/category/blog-category.module';
import { BlogPostModule } from './ui/pages/blogs/post/blog-post.module';
import { BlogCommentModule } from './ui/pages/blogs/comment/blog-comment.module';
import { StoreBrandModule } from 'src/stores/brand/store-brand.module';
import { SellTypeModule } from './stores/sell-type/sell-type.module';
import { SearchModule } from './search/search.module';
import { ProductGroupModule } from './products/groups/product-group.module';
import { ProductCommentModule } from './products/comment/product-comment.module';
import { RefreshModule } from './settings/refresh/refresh.module';
import { WsModule } from './infrastructure/ws/ws.module';
import { ProductAttributesModule } from './products/attributes/product-attributes.module';
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
