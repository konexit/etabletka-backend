import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from './entities/city.entity';
import { CityService } from './city.service';
import { CityController } from './city.controller';
import { Store } from 'src/stores/store/entities/store.entity';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [TypeOrmModule.forFeature([City, Store]), CacheModule.register()],
  controllers: [CityController],
  providers: [CityService],
  exports: [CityService, CityModule],
})
export class CityModule {}
