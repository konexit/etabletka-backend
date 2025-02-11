import { BodyList, OrderJSON } from "src/common/types/order";
import { OrderChangeType, OrderChangeActionType, OrderChangeAutoApliedMode } from "../trade.constants";

type OrderChangeActionMap = {
  head: OrderChangeActionType.Update;
  body_list: OrderChangeActionType;
  status_code: OrderChangeActionType.Update;
  comment: OrderChangeActionType.Update;
};

type OrderChangePayloadMap = {
  head: OrderJSON;
  body_list: BodyList;
  status_code: { status_code: string };
  comment: { comment: string; };
};

interface OrderChange<T extends OrderChangeType> {
  type: T;
  action: OrderChangeActionMap[T];
  payload: OrderChangePayloadMap[T];
}

export interface TradeOrderChange {
  order_id: number;
  auto_applied: OrderChangeAutoApliedMode;
  changes: Array<OrderChange<OrderChangeType>>;
}
