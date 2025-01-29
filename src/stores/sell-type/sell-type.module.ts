import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellType } from './entities/sell-type.entity';
import { SellTypeController } from './sell-type.controller';
import { SellTypeService } from './sell-type.service';

@Module({
  imports: [TypeOrmModule.forFeature([SellType])],
  controllers: [SellTypeController],
  providers: [SellTypeService],
  exports: [SellTypeService, SellTypeModule],
})
export class SellTypeModule {}
