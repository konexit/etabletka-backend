import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FaqItem } from './entities/faq-item.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FaqItemService {
  constructor(
    @InjectRepository(FaqItem)
    private readonly faqItemRepository: Repository<FaqItem>,
  ) {}

  async getAllPublished(): Promise<FaqItem[]> {
    const faqItems = await this.faqItemRepository.find({
      where: { isPublished: true },
    });

    if (!faqItems) {
      throw new HttpException('Faq items  not found', HttpStatus.NOT_FOUND);
    }

    return faqItems;
  }
}
