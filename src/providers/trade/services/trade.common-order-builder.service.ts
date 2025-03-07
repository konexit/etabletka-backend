import { CommonOrder } from "src/common/types/order/common-order.interface";
import { OrderBuilder } from "./trade.base-order-builder.service";

export class CommonOrderBuilder extends OrderBuilder<CommonOrder> {
  constructor() {
    super();
    this.order.order_type_id = 1;
  }

  setClientInfo(clientInfo: CommonOrder["client_info"]): this {
    this.order.client_info = clientInfo;
    return this;
  }
}
