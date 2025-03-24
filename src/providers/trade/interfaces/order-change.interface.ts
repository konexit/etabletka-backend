import { BodyList, OrderJSON } from "src/common/types/order";
import { TradeOrderChangeType, TradeOrderChangeActionType, TradeOrderChangeAutoApliedMode } from "../trade.constants";

export type OrderChangeActionMap = {
  head: TradeOrderChangeActionType.Update;
  body_list: TradeOrderChangeActionType;
  status_code: TradeOrderChangeActionType.Update;
  comment: TradeOrderChangeActionType.Update;
}

export type OrderChangePayloadMap = {
  head: OrderJSON;
  body_list: BodyList;
  status_code: { status_code: string; };
  comment: { status_msg: string; };
}

export interface OrderChange<T extends TradeOrderChangeType> {
  type: T;
  action: OrderChangeActionMap[T];
  payload: OrderChangePayloadMap[T];
}

export interface TradeOrderChange {
  order_id: number;
  change_id: number;
  trade_pnt_id: number;
  order_status: string;
  aggregator_order_id: string;
  auto_applied: TradeOrderChangeAutoApliedMode;
  changes: Array<OrderChange<TradeOrderChangeType>>;
}

export interface TradeOrderChangeAggregator {
  order_id: number;
  auto_applied: TradeOrderChangeAutoApliedMode;
  changes: Array<OrderChange<TradeOrderChangeType>>;
}

export interface TradeOrderChangesAggregator {
  order_changes: TradeOrderChangeAggregator[];
}

export interface TradeErrorOrderChange {
  order_id: number;
  codeError: number;
  message: string;
}

export interface TradeOrderChangeResponse {
  handled_orders: number[];
  error_orders: TradeErrorOrderChange[];
}