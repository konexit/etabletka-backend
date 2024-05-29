import { Controller, Get, Param, Res } from '@nestjs/common';
import { DiscountService } from './discount.service';

@Controller('api/v1/discounts')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}
}
