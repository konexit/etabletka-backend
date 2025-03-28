import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KatottgService } from './katottg.service';
import { KatottgController } from './katottg.controller';
import { Store } from 'src/store/entities/store.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { Katottg } from './entities/katottg.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Katottg, Store]), CacheModule.register()],
  controllers: [KatottgController],
  providers: [KatottgService],
  exports: [KatottgService, KatottgModule],
})
export class KatottgModule { }
