import { ToOrder } from "src/common/types/order/to-order.interface";
import { OrderBuilder } from "./trade.base-order-builder.service";

export class ToOrderBuilder extends OrderBuilder<ToOrder> {
	constructor() {
		super();
		this.order.order_type_id = 3;
	}

	setExpiration(expiration: string): this {
		this.order.expiration = expiration;
		return this;
	}

	setInvoiceCodes(invoiceCodes: ToOrder["invoice_codes"]): this {
		this.order.invoice_codes = invoiceCodes;
		return this;
	}

	setCompanyInfo(companyInfo: ToOrder["company_info"]): this {
		this.order.company_info = companyInfo;
		return this;
	}
}