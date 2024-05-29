import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductBadge } from './entities/productBadge.entity';

@Injectable()
export class ProductBadgeService {
  constructor(
    @InjectRepository(ProductBadge)
    private productBadgeRepository: Repository<ProductBadge>,
  ) {}
}
