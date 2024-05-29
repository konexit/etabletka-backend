import { Controller } from '@nestjs/common';
import { ProductBadgeService } from './productBadge.service';

@Controller('product-badge')
export class ProductBadgeController {
  constructor(private readonly productBageService: ProductBadgeService) {}
}
