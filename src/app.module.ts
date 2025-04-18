import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { JwtTokenModule } from './auth/jwt/jwt-token.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dataSourceOptions } from '../db/data-source';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from './auth/auth.module';
import { DiscountGroupModule } from './promo/discount-group/discount-group.module';
import { DiscountModule } from './promo/discount/discount.module';
import { ProductModule } from './products/product/product.module';
import { ProductRemnantModule } from './products/remnants/product-remnant.module';
import { ProductTypeModule } from './products/types/product-type.module';
import { KatottgModule } from './katottg/katottg.module';
import { CategoriesModule } from './categories/categories.module';
import { PageModule } from './ui/pages/page/page.module';
import { FaqItemModule } from './ui/pages/faq-item/faq-item.module';
import { BannerModule } from 'src/ui/banner/banner.module';
import { BadgeModule } from './products/badge/badge.module';
import { StoreModule } from 'src/store/store.module';
import { MenuModule } from './ui/menu/menu.module';
import { SiteOptionModule } from './settings/site-options/site-option.module';
import { BrandsModule } from './brands/brands.module';
import { ArticleModule } from './ui/pages/article/article.module';
import { CompanyModule } from 'src/company/company.module';
import { SearchModule } from './search/search.module';
import { ProductGroupModule } from './products/groups/product-group.module';
import { RefreshModule } from './settings/refresh/refresh.module';
import { WsModule } from './infrastructure/ws/ws.module';
import { ProductAttributesModule } from './products/attributes/product-attributes.module';
import { CartModule } from './commerce/cart/cart.module';
import { OrderModule } from './commerce/order/order.module';
import { TradeModule } from './providers/trade/trade.module';
import { CDNModule } from './providers/cdn/cdn.module';
import { SMSModule } from './providers/sms/sms.module';
import { CommentModule } from './comment/comment.module';

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
    JwtTokenModule,
    ScheduleModule.forRoot(),
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
    KatottgModule,
    UserModule,
    CategoriesModule,
    CompanyModule,
    StoreModule,
    MenuModule,
    SiteOptionModule,
    BrandsModule,
    ArticleModule,
    SearchModule,
    RefreshModule,
    WsModule,
    ProductAttributesModule,
    CartModule,
    OrderModule,
    TradeModule,
    CDNModule,
    SMSModule,
    CommentModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
