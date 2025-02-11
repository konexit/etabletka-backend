import { CommonOrder } from "./common-order.interface";
import { InsuranceOrder } from "./insurance-order.interface";
import { ToOrder } from "./to-order.interface";
import { OrderStatus } from "./order-statuses.interface";

export { BodyList } from './order-body-list.interface';
export { OrderStatus } from './order-statuses.interface';
export type OrderJSON = CommonOrder | InsuranceOrder | ToOrder;
export type OrderStatusesJSON = OrderStatus[];
