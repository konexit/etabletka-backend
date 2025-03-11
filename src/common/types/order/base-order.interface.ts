import type { BodyList } from './order-body-list.interface';

export interface PaymentInfo {
  payment_type_id: number;
  payment_status_id: number;
}

export interface DeliveryInfo {
  delivery_type_id: number;
  delivery_status_id: number;
}

export interface CompanyInfo {
  name: string;
  edrpou: number;
  address: string;
  company_id: number;
  revaluation: boolean;
  mobile_phone: string;
  allow_change_order: boolean;
}

export interface BaseOrder {
  comment: string | null;
  order_id: number;
  body_list: Array<BodyList>;
  order_sum: number;
  order_time: string;
  expiration: string;
  status_msg: string;
  marketplace: string;
  status_code: string;
  trade_pnt_id: number;
  client_info: object;
  company_info: CompanyInfo;
  payment_info: PaymentInfo;
  delivery_info: DeliveryInfo;
  notification_type: number;
  aggregator_order_id: string;
  order_type_id: number;
  fiscal_check_id: string | null;
}
