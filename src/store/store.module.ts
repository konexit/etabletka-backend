import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [TypeOrmModule.forFeature([Store]), CacheModule.register()],
  controllers: [StoreController],
  providers: [StoreService],
  exports: [StoreService, StoreModule],
})
export class StoreModule {}
