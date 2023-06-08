export interface IMerchant {
  id: number;
  name: string;
  merchantTypeId: number;
  merchantName?: string;
}

export interface IMerchantType {
  id: number;
  name: `${EMerchantType}`;
}

export enum EMerchantType {
  GAS_AUTOMOTIVE = 'Gas/Automotive',
  MERCHANDISE = 'Merchandise',
  DINING = 'Dining',
  PAYMENT = 'Payment/Credit',
  OTHER = 'Other',
  ENTERTAINMENT = 'Entertainment',
  INTERNET = 'Internet',
  AIRFARE = 'Airfare',
  INSURANCE = 'Insurance',
  HEALTH_CARE = 'Health Care',
  TRANSFER = 'Transfer'
}
