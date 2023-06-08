import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAccount } from '@models/account';
import { Observable, mergeMap } from 'rxjs';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  private accountsUrl = 'api/accounts';

  constructor(
    private http: HttpClient,
    private usersService: UsersService
  ) { }

  getAccounts(): Observable<IAccount[]> {
    return this.http.get<IAccount[]>(this.accountsUrl);
  }

  getAccountById() {
    return this.usersService.userLoggedIn$.pipe(
      mergeMap((userloggedIn) => this.http.get<IAccount>(`${this.accountsUrl}/${userloggedIn.userAccounts[0].accountId}`))
    )
  }
}
