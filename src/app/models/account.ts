export interface IAccount {
  id: number;
  accountNumber: string;
  routingNumber: string;
  accountType: `${EAccountType}`;
}

export enum EAccountType {
  CHECKING = 'Checking',
  SAVINGS = 'Savings',
  CREDIT = 'Credit'
}

