import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [TypeOrmModule.forFeature([Menu]), CacheModule.register()],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService, MenuModule],
})
export class MenuModule {}
