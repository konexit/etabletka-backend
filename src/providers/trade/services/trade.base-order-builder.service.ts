import { BodyList } from "src/common/types/order";
import {
  BaseOrder,
  CompanyInfo,
  DeliveryInfo,
  PaymentInfo
} from "src/common/types/order/base-order.interface";

export class OrderBuilder<T extends BaseOrder> {
  protected order: Partial<T> = {};

  constructor(order: Partial<T> = {}) {
    this.order = {
      comment: null,
      fiscal_check_id: null,
      order_id: 0,
      aggregator_order_id: '',
      trade_pnt_id: 0,
      body_list: [],
      order_sum: 0,
      order_time: '',
      expiration: '',
      status_msg: '',
      marketplace: '',
      status_code: '',
      client_info: {},
      company_info: {},
      payment_info: {},
      delivery_info: {},
      notification_type: 0,
      ...order,
    };
  }

  setComment(comment: string | null): this {
    this.order.comment = comment;
    return this;
  }

  setOrderId(orderId: number): this {
    this.order.order_id = orderId;
    return this;
  }

  setBodyList(bodyList: Array<BodyList>): this {
    this.order.body_list = bodyList;
    return this;
  }

  setOrderSum(orderSum: number): this {
    this.order.order_sum = orderSum;
    return this;
  }

  setOrderTime(orderTime: string): this {
    this.order.order_time = orderTime;
    return this;
  }

  setExpiration(expiration: string): this {
    this.order.expiration = expiration;
    return this;
  }

  setStatusMsg(statusMsg: string): this {
    this.order.status_msg = statusMsg;
    return this;
  }

  setClientInfo(clientInfo: object): this {
    this.order.client_info = clientInfo;
    return this;
  }

  setMarketplace(marketplace: string): this {
    this.order.marketplace = marketplace;
    return this;
  }

  setStatusCode(statusCode: string): this {
    this.order.status_code = statusCode;
    return this;
  }

  setCompanyInfo(companyInfo: CompanyInfo): this {
    this.order.company_info = companyInfo;
    return this;
  }

  setPaymentInfo(paymentInfo: PaymentInfo): this {
    this.order.payment_info = paymentInfo;
    return this;
  }

  setTradePointId(tradePntId: number): this {
    this.order.trade_pnt_id = tradePntId;
    return this;
  }

  setDeliveryInfo(deliveryInfo: DeliveryInfo): this {
    this.order.delivery_info = deliveryInfo;
    return this;
  }

  setNotificationType(notificationType: number): this {
    this.order.notification_type = notificationType;
    return this;
  }

  setAggregatorOrderId(aggregatorOrderId: string): this {
    this.order.aggregator_order_id = aggregatorOrderId;
    return this;
  }

  setOrderTypeId(orderTypeId: number): this {
    this.order.order_type_id = orderTypeId;
    return this;
  }

  build(): T {
    return this.order as T;
  }
}
