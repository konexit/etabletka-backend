import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnotherPoint } from './entities/anotherPoint.entity';
import { AnotherPointController } from './anotherPoint.controller';
import { AnotherPointService } from './anotherPoint.service';

@Module({
  imports: [TypeOrmModule.forFeature([AnotherPoint])],
  controllers: [AnotherPointController],
  providers: [AnotherPointService],
  exports: [AnotherPointService, AnotherPointModule],
})
export class AnotherPointModule {}
