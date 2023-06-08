import { EMerchantType } from "./merchant";

export interface ITransaction {
  id?: number;
  merchantId: number;
  amount: number;
  userId: number;
  transactionType: ETransactionType;
  date: string;
  accountId: number;
  userName?: string;
  accountNumber?: string;
  merchantName?: string;
  merchantType?: `${EMerchantType}`;
}

export enum ETransactionType {
  SPENT,
  REFUND,
  CASH_BACK,
  PAYMENT,
  TRANSFER
}

export interface ITranfer {
  from: number;
  to: number;
  date: string;
  amount: number;
}
