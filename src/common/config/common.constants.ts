export const USER_PASSWORD_ACTIVATION_CODE_SIZE = 4;
export const USER_ACTIVATION_CODE_DELAY = 60;

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

export enum OrderTypes {
  Common = 1,
  Insurance = 2,
  ToOrder = 3
}

