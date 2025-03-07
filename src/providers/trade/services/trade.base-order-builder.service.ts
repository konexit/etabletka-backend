import { BodyList } from "src/common/types/order";
import { BaseOrder } from "src/common/types/order/base-order.interface";

export class OrderBuilder<T extends BaseOrder> {
	protected order: Partial<T> = {};

	setComment(comment: string | null): this {
		this.order.comment = comment;
		return this;
	}

	setOrderId(orderId: number): this {
		this.order.order_id = orderId;
		return this;
	}

	setBodyList(bodyList: Array<BodyList>): this {
		this.order.body_list = bodyList;
		return this;
	}

	setOrderSum(orderSum: number): this {
		this.order.order_sum = orderSum;
		return this;
	}

	setOrderTime(orderTime: string): this {
		this.order.order_time = orderTime;
		return this;
	}

	setStatusMsg(statusMsg: string): this {
		this.order.status_msg = statusMsg;
		return this;
	}

	setClientInfo(clientInfo: object): this {
		this.order.client_info = clientInfo;
		return this;
	}

	setMarketplace(marketplace: string): this {
		this.order.marketplace = marketplace;
		return this;
	}

	setStatusCode(statusCode: string): this {
		this.order.status_code = statusCode;
		return this;
	}

	setCompanyInfo(companyInfo: object): this {
		this.order.company_info = companyInfo;
		return this;
	}

	setPaymentInfo(paymentInfo: object): this {
		this.order.payment_info = paymentInfo;
		return this;
	}

	setTradePointId(tradePntId: number): this {
		this.order.trade_pnt_id = tradePntId;
		return this;
	}

	setDeliveryInfo(deliveryInfo: object): this {
		this.order.delivery_info = deliveryInfo;
		return this;
	}

	setNotificationType(notificationType: number): this {
		this.order.notification_type = notificationType;
		return this;
	}

	setAggregatorOrderId(aggregatorOrderId: string): this {
		this.order.aggregator_order_id = aggregatorOrderId;
		return this;
	}

	setOrderTypeId(orderTypeId: number): this {
		this.order.order_type_id = orderTypeId;
		return this;
	}

	build(): T {
		return this.order as T;
	}
}
