import { OrderJSON } from "src/common/types/order";

export interface TradeOrder {
  tradeOrderId: number;
  aggregatorOrderId: string;
  order: OrderJSON;
}

export interface TradeOrders {
  orders: TradeOrder[];
}

export interface TradeBaseOrder {
  tradeOrderId: number;
  index: number;
  aggregatorOrderId: string;
}

export interface TradeHandledOrder extends TradeBaseOrder { }

export interface TradeErrorOrder extends TradeBaseOrder {
  codeError: number;
  message: string;
}

export interface OrdersResponse {
  handled_orders: TradeHandledOrder[];
  error_orders: TradeErrorOrder[];
}


export interface IOrdersOptions {
  orderType: number;
  action: string;
}