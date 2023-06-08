import { IAccount } from "@models/account";
import { IMerchant, IMerchantType } from "@models/merchant";
import { ITransaction } from "@models/transaction";
import { IUser, IUserAccount } from "@models/user";
import { InMemoryDbService } from "angular-in-memory-web-api";
import { UserData } from "./users-data";
import { AccountData } from "./accounts-data";
import { MerchantData } from "./merchants-data";
import { MerchantType } from "./merchants-type-data";
import { TransactionData } from "./transactions-data";

export class AppData implements InMemoryDbService {
  createDb(): {
    users: IUser[],
    accounts: IAccount[],
    userAccounts: IUserAccount[],
    merchants: IMerchant[],
    merchantsType: IMerchantType[],
    transactions: ITransaction[]
  } {
    return {
      users: UserData.users,
      accounts: AccountData.accounts,
      userAccounts: UserData.userAccounts,
      merchants: MerchantData.merchants,
      merchantsType: MerchantType.merchantsType,
      transactions: TransactionData.transactions
    }
  }
}
