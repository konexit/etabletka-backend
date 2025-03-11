import { TradeStateOrderPickOption } from "../trade.constants";
import { TradeOrderChange } from "./change.interface";
import { TradeOrderStatus } from "./status.interface";

export interface ITradeStateOrdersOptions {
  pick: TradeStateOrderPickOption;
  limit: number;
  orderTypes?: number[];
  tradePoints?: number[];

  getQueryParams(): string;
}

export interface TradeStateOrdersResponse {
  changed_orders: TradeOrderChange[];
  statuses: TradeOrderStatus[];
}

export interface ITradeStateOrdersAppliedOptions {
  handled_statuses_ids: number[];
  handled_change_ids: number[];
}

export interface TradeStateOrdersAppliedResponse {
  applied_statuses: boolean;
  applied_changes: boolean;
}