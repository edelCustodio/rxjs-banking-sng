import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { IUser, IUserAccount } from '@models/user';
import { UsersService } from '@modules/services/users.service';
import { Observable } from 'rxjs';

export const appResolver: ResolveFn<Observable<{
  user: IUser;
  userAccounts: IUserAccount[];
}>> = (route, state) => {
  return inject(UsersService).userLoggedIn$;
};
