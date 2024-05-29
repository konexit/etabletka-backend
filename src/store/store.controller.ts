import { Controller } from '@nestjs/common';
import { StoreService } from './store.service';

@Controller('api/v1/store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}
}
