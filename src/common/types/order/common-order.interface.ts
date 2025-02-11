import { BaseOrder } from "./base-order.interface";

export interface CommonOrder extends BaseOrder {
  order_type_id: 1;
  client_info: {
    customer: {
      name: string;
      address: string;
      user_id: number;
      sur_name: string;
      last_name: string;
      mobile_phone: string;
    };
    recipient: {
      name: string;
      address: string;
      user_id: number;
      sur_name: string;
      last_name: string;
      mobile_phone: string;
    };
    recipient_order: string;
  };
};
