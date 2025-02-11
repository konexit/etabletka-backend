import { BaseOrder } from "./base-order.interface";

export interface ToOrder extends BaseOrder {
  order_type_id: 3;
  expiration: string;
  invoice_codes: Array<{
    invoice_code: string;
    invoice_delivery_date: string;
  }>;
  company_info: {
    allow_change_order: boolean;
  };
};
