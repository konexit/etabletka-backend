import { StateOrderPickOption } from "../trade.constants";
import { TradeOrderChange } from "./change.interface";
import { TradeOrderStatus } from "./status.interface";

export interface IStateOrdersOptions {
  pick: StateOrderPickOption;
  limit: number;
  orderTypes?: number[];
  tradePoints?: number[];

  getQueryParams(): string;
}

export interface StateOrdersResponse {
  changed_orders: TradeOrderChange[];
  statuses: TradeOrderStatus[];
}