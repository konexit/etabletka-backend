import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FaqItem } from './entities/faq-item.entity';
import { FaqItemController } from './faq-item.controller';
import { FaqItemService } from './faq-item.service';

@Module({
  imports: [TypeOrmModule.forFeature([FaqItem])],
  controllers: [FaqItemController],
  providers: [FaqItemService],
  exports: [FaqItemService, FaqItemModule],
})
export class FaqItemModule {}
