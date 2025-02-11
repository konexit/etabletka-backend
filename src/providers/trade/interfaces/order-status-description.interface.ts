export namespace Trade {
  export interface OrderStatusDescription {
    status_id: number;
    code: string;
    type: string;
    description: string;
    order_index: number;
    is_manual: boolean;
  }
}