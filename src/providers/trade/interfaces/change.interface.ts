import { BodyList, OrderJSON } from "src/common/types/order";
import { TradeOrderChangeType, TradeOrderChangeActionType, TradeOrderChangeAutoApliedMode } from "../trade.constants";

type OrderChangeActionMap = {
  head: TradeOrderChangeActionType.Update;
  body_list: TradeOrderChangeActionType;
  status_code: TradeOrderChangeActionType.Update;
  comment: TradeOrderChangeActionType.Update;
};

type OrderChangePayloadMap = {
  head: OrderJSON;
  body_list: BodyList;
  status_code: { status_code: string };
  comment: { comment: string; };
};

interface OrderChange<T extends TradeOrderChangeType> {
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
