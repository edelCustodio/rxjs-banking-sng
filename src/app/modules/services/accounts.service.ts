import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAccount } from '@models/account';
import { Observable, catchError, mergeMap, shareReplay, tap, throwError } from 'rxjs';
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

  accountById$ = this.usersService.userLoggedIn$
  .pipe(
    mergeMap((userloggedIn) => this.http.get<IAccount>(`${this.accountsUrl}/${userloggedIn.userAccounts[0].accountId}`)),
    tap(data => console.log('Account by Id: ', JSON.stringify(data))),
    shareReplay(1),
    catchError(this.handleError)
  )


  private handleError(err: HttpErrorResponse): Observable<never> {

    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.message}`;
    }
    console.error(err);
    return throwError(() => errorMessage);
  }
}
