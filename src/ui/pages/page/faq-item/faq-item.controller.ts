import { Controller, Get } from '@nestjs/common';
import { FaqItemService } from './faq-item.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('faq-items')
@Controller('api/v1')
export class FaqItemController {
  constructor(private readonly faqItemService: FaqItemService) {}

  @Get('/faq-items')
  async getAllPublished() {
    return await this.faqItemService.getAllPublished();
  }
}
