import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITransaction } from '@models/transaction';
import { Observable, catchError, combineLatest, map, mergeAll, mergeMap, shareReplay, tap, throwError } from 'rxjs';
import { UsersService } from './users.service';
import { MerchantsService } from './merchants.service';
import { AccountsService } from './accounts.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  private transactionsUrl = 'api/transactions';

  constructor(
    private http: HttpClient,
    private usersService: UsersService,
    private merchantsService: MerchantsService,
    private accountsService: AccountsService,
  ) { }

  transactions$ = this.http.get<ITransaction[]>(this.transactionsUrl)
  .pipe(
    tap(data => console.log('Transactions: ', JSON.stringify(data))),
    catchError(this.handleError),
    shareReplay(1),
  );

  transactionsWithAllData$ = combineLatest([
    this.transactions$,
    this.usersService.userLoggedIn$,
    this.merchantsService.merchantsWithTypes$,
    this.accountsService.accountById$
  ])
  .pipe(
    map(([transactions, userLoggedIn, merchants, account]) => transactions.map(
      (transaction: ITransaction) => ({
        ...transaction,
        userName: userLoggedIn.user.firstName,
        merchantName: merchants.find(m => m.id === transaction.merchantId)?.name,
        merchantType: merchants.find(m => m.id === transaction.merchantId)?.merchantName,
        accountNumber: account.accountNumber
      } as ITransaction)).sort((a, b) => (Date.parse((new Date(b.date).toString())) - Date.parse((new Date(a.date)).toString())))
    ),
    tap(data => console.log('transactionsWithAllData: ', JSON.stringify(data))),
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


