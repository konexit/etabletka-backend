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
import { ProductTypeModule } from './productTypes/productType.module';
import { AnotherPointModule } from './places/anotherPoint/anotherPoint.module';
import { RegionModule } from './places/region/region.module';
import { CityModule } from './places/city/city.module';
import { CommunityModule } from './places/communitiy/community.module';
import { DistrictModule } from './places/district/district.module';
import { CategoriesModule } from './categories/categories.module';
import { PageModule } from './page/page.module';
import { FaqItemModule } from './page/faqItem/faqItem.module';
import { BannerModule } from './banner/banner.module';
import { BadgeModule } from './badge/badge.module';
import { StoreModule } from './store/store.module';
import { OrderModule } from './order/order.module';
import { MenuModule } from './menu/menu.module';
import { SiteOptionModule } from './siteOptions/siteOption.module';
import { RoleModule } from './role/role.module';
import { UserProfileModule } from './userProfile/userProfile.module';
import { BrandsModule } from './brands/brands.module';
import { BlogCategoryModule } from './blogCategoty/blogCategory.module';
import { BlogPostModule } from './blogPost/blogPost.module';
import { BlogCommentModule } from './blogComment/blogComment.module';
import { StoreBrandModule } from './storeBrand/store-brand.module';

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
    FaqItemModule,
    PageModule,
    ProductModule,
    ProductTypeModule,
    ProductRemnantModule,
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
