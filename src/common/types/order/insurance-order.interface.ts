import { BaseOrder } from "./base-order.interface";

export interface InsuranceOrder extends BaseOrder {
	order_type_id: 2;
	client_info: {
		doctor: {
			id: number;
			name: string;
			address: string;
			sur_name: string;
			last_name: string;
			mobile_phone: string;
		};
		patient: {
			id: number;
			name: string;
			address: string;
			sur_name: string;
			diagnosis: string;
			last_name: string;
			mobile_phone: string;
			service_card: string;
			policy_number: string;
		};
	};
}
