import { EAccountType, IAccount } from "@models/account";

export class AccountData {
  static accounts: IAccount[] = [
    {
      id: 1,
      accountNumber: '1234',
      routingNumber: '5678',
      accountType: 'Savings'
    }
  ]
}
