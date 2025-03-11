export const TRADE_SERVICES_URL = "TRADE_SERVICES_URL";

export const TRADE_PROVIDER_MANAGER = "TRADE_PROVIDER_MANAGER";

export const TRADE_CODE_ERROR_ALREADY_HAS_BEEN_SAVED = 2;

export const TRADE_STATE_ORDER_LIMIT_DEFAULT = 100;

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