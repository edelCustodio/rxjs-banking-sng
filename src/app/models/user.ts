export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
}

export interface IUserAccount {
  id: number;
  userId: number;
  accountId: number;
}
