import { Injectable } from '@nestjs/common';
import { CommonOrderBuilder } from './trade.common-order-builder.service';
import { InsuranceOrderBuilder } from './trade.insurance-order-builder.service';
import { ToOrderBuilder } from './trade.to-order-builder.service';
import { BodyListBuilder } from './trade.common-body-list-builder.service';

@Injectable()
export class OrderService {
  createCommonBodyListBuilder(): BodyListBuilder {
    return new BodyListBuilder();
  }

  createCommonOrderBuilder(): CommonOrderBuilder {
    return new CommonOrderBuilder();
  }

  createInsuranceOrderBuilder(): InsuranceOrderBuilder {
    return new InsuranceOrderBuilder();
  }

  createToOrderBuilder(): ToOrderBuilder {
    return new ToOrderBuilder();
  }
}
