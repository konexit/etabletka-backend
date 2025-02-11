export interface TradeOrderStatus {
  status_id: number;
  code: string;
  order_id: number;
  aggregator_order_id: string;
  order_type_id: number;
  trade_pnt_id: number;
  date: string;
  comment: string;
}