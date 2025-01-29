import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnotherPoint } from './entities/another-point.entity';
import { AnotherPointController } from './another-point.controller';
import { AnotherPointService } from './another-point.service';

@Module({
  imports: [TypeOrmModule.forFeature([AnotherPoint])],
  controllers: [AnotherPointController],
  providers: [AnotherPointService],
  exports: [AnotherPointService, AnotherPointModule],
})
export class AnotherPointModule {}
