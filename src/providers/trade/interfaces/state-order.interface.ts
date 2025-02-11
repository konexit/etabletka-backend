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

export interface IStateOrdersAppliedOptions {
  handled_statuses_ids: number[];
  handled_change_ids: number[];
}

export interface StateOrdersAppliedResponse {
  applied_statuses: boolean;
  applied_changes: boolean;
}