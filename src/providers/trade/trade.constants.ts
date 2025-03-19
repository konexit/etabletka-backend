export const TRADE_SERVICES_URL = 'TRADE_SERVICES_URL';

export const TRADE_PROVIDER_MANAGER = 'TRADE_PROVIDER_MANAGER';

export const TRADE_CODE_ERROR_ALREADY_HAS_BEEN_SAVED = 2;

export const TRADE_STATE_ORDER_LIMIT_DEFAULT = 100;

export enum TradeOrderStatusCodes {
	Created = '00',
	Confirmed = '10',
	InPharmacy = '20',
	DeliveredToPharmacy = '22',
	OnAssembly = '30',
	Collected = '40',
	Closed = '50',
	Destroy = '60',
	WaitClient = '70',
	Assembling = '80',
};

export enum TradeOrderStatusOwners {
	Trade = '0',
	Dovidka = '1',
	PharmacySoftware = '2',
	Pharmacist = '3',
	TechSupport = '4',
	OneC = '5',
	Aggregator = '7',
};

export namespace TradeStatusActions {
	export enum Call {
		NeedConsultation = '02',
		AutoApproved = '03',
		NeedPartialConfirmationWithUser = '04',
	};

	export enum Process {
		NeedProcessing = '11',
		Processed = '12',
		ReadyForPharmacy = '13',
		Reserved = '14',
		FailedProcessing = '15',
		BlockEditing = '16',
		ChangeExpirationTime = '17',
		AddedFiscalCheck = '18',
		ExpiredAwaitingConfirmation = '19',
	};

	export enum Edit {
		MultipleItems = '40',
		AddItems = '41',
		RemoveItems = '42',
		Items = '43',
		Header = '44',
		Comment = '45',
		PartialProcessed = '46',
	};

	export enum Cancel {
		InvalidOrder = '01',
		RefusedPrice = '60',
		RefusedStock = '61',
		ManualStock = '62',
		TestOrder = '63',
		Consultation = '64',
		Discount = '65',
		NoPrescription = '66',
		Comment = '67',
		TimeExpired = '68',
		Customer = '69',
		Auto = '70',
		NoConnectionWithPharmacy = '71',
		ExpirationDateNotSuitable = '72',
	};
};

export enum TradeOrderMode {
	Forward = 'forward'
};

export enum TradeOrderChangeAutoApliedMode {
	All = 'all',
	None = 'none',
	Pharmacy = 'pharmacy',
	Aggregator = 'aggregator'
};

export enum TradeOrderChangeType {
	Head = 'head',
	BodyList = 'body_list',
	StatusCode = 'status_code',
	Comment = 'comment'
};

export enum TradeOrderChangeActionType {
	Update = 'update',
	Add = 'add',
	Delete = 'delete'
};

export enum TradeStateOrderPickOption {
	One = 'one',
	Many = 'many'
};