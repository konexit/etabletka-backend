import { InsuranceOrder } from "src/common/types/order/insurance-order.interface";
import { OrderBuilder } from "./trade.base-order-builder.service";

export class InsuranceOrderBuilder extends OrderBuilder<InsuranceOrder> {
  constructor() {
    super();
    this.order.order_type_id = 2;
  }

  setClientInfo(clientInfo: InsuranceOrder["client_info"]): this {
    this.order.client_info = clientInfo;
    return this;
  }
}
