export interface BaseOrder {
    comment: string | null;
    order_id: number;
    body_list: Array<{
        nds: number;
        count: number;
        row_id: number;
        goods_id: number;
        franchise: number;
        order_raw_id: number;
        price_amount: number;
        price_income: number;
        price_outcome: number;
        price_internet: number;
    }>;
    order_sum: number;
    order_time: string;
    status_msg: string;
    client_info: object;
    marketplace: string;
    status_code: string;
    company_info: object;
    payment_info: object;
    trade_pnt_id: number;
    delivery_info: object;
    notification_type: number;
    aggregator_order_id: string;
    order_type_id: number;
}
