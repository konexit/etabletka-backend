export const USER_PASSWORD_ACTIVATION_CODE_SIZE = 4;
export const USER_MINIMUM_AGE = 14;
export const USER_ACTIVATION_CODE_DELAY = 60;
export const KATOTTG_VINNYTSIA = 'UA05020030010063857';

export const COMPANY_ETABLETKA_ID = 1;
export const COMPANY_BOOKING_DATE = 2;
export const COMPANY_MARKETPLACE = 'eTabletka';
export const COMPANY_ORDER_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const COMPANY_ORDER_COMPANY_INFO = {
  "name": "eTabletka",
  "edrpou": 0,
  "address": "м. Вінниця Київська 136г",
  "company_id": 0,
  "revaluation": true,
  "mobile_phone": "0800355050",
  "allow_change_order": true
}

export const JWT_DEFAULT_EXPIRES_IN = '3600s';

export enum PaymentStatus {
  Pending = 1,
  Paid = 2,
  Refunded = 3,
  Canceled = 4
}

export enum PaymentType {
  Card = 1,
  Credit = 2,
  Check = 3,
  Cash = 4,
  Certificate = 5,
  Voucher = 6,
  EMoney = 7,
  InsurancePayout = 8,
  Prepayment = 9,
  Payment = 10
}

export enum OrderTypes {
  Common = 1,
  Insurance = 2,
  ToOrder = 3
}

