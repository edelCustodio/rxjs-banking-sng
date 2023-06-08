import { IUser, IUserAccount } from "@models/user";

export class UserData {

  static users: IUser[] = [
    {
      id: 1,
      firstName: 'Edel',
      lastName: 'Custodio',
      email: 'my@mail.com',
      address: 'my awesome address'
    }
  ]

  static userAccounts: IUserAccount[] = [
    {
      id: 1,
      userId: 1,
      accountId: 1
    }
  ]
}
