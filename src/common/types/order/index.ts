import type { CommonOrder } from './common-order.interface';
import type { InsuranceOrder } from './insurance-order.interface';
import type { ToOrder } from './to-order.interface';
import type { OrderStatus } from './order-statuses.interface';

export { BodyList } from './order-body-list.interface';
export { OrderStatus } from './order-statuses.interface';
export type OrderJSON = CommonOrder | InsuranceOrder | ToOrder;
export type OrderStatusesJSON = OrderStatus[];
