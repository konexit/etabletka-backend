import { Controller, Get } from '@nestjs/common';
import { FaqItemService } from './faq-item.service';

@Controller('api/v1')
export class FaqItemController {
  constructor(private readonly faqItemService: FaqItemService) {}

  @Get('/faq-items')
  async getAllPublished() {
    return await this.faqItemService.getAllPublished();
  }
}
