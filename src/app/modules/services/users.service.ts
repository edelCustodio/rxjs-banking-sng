import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser, IUserAccount } from '@models/user';
import { Observable, combineLatest, map, mergeMap, shareReplay, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private usersUrl = 'api/users';
  private userAccountsUrl = 'api/userAccounts';

  constructor(
    private http: HttpClient,
  ) { }

  user$ = this.http.get<IUser>(`${this.usersUrl}/1`).pipe(tap(console.log));
  userAccounts$ = this.http.get<IUserAccount[]>(`${this.userAccountsUrl}?userId=${1}`).pipe(tap(console.log))

  userLoggedIn$ = combineLatest([
    this.user$,
    this.userAccounts$
  ]).pipe(
    map(([user, userAccounts]) => ({ user, userAccounts })),
    shareReplay(1)
  )

  putUser(user: IUser) {
    return this.http.put<void>(`${this.usersUrl}/${user.id}`, user);
  }
}
