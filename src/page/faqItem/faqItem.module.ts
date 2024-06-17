import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FaqItem } from './entities/faqItem.entity';
import { FaqItemController } from './faqItem.controller';
import { FaqItemService } from './faqItem.service';

@Module({
  imports: [TypeOrmModule.forFeature([FaqItem])],
  controllers: [FaqItemController],
  providers: [FaqItemService],
  exports: [FaqItemService, FaqItemModule],
})
export class FaqItemModule {}
