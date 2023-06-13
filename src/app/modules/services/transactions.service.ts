import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITransaction } from '@models/transaction';
import { Observable, Subject, catchError, combineLatest, concatMap, finalize, map, merge, of, scan, shareReplay, tap, throwError } from 'rxjs';
import { UsersService } from './users.service';
import { MerchantsService } from './merchants.service';
import { AccountsService } from './accounts.service';
import { IAction } from '@models/crud-actions';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  private transactionsUrl = 'api/transactions';

  private transactionModifiedSubject = new Subject<IAction<ITransaction>>();
  transactionModifiedAction$ = this.transactionModifiedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private usersService: UsersService,
    private merchantsService: MerchantsService,
    private accountsService: AccountsService,
    private router: Router
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

  transactionsWithCRUD$ = merge(
    this.transactionsWithAllData$,
    this.transactionModifiedAction$.pipe(
      tap(data => console.log('transactionModifiedAction: ', JSON.stringify(data))),
      concatMap(operation => this.usersService.userLoggedIn$.pipe(map(({ user }) => ( { ...operation, item: { ...operation.item, userId: user.id } } as IAction<ITransaction>)))),
      tap(data => console.log('transactionModifiedAction with User: ', JSON.stringify(data))),
      concatMap(operation => this.saveTransaction(operation)),
      tap(data => console.log('saveTransaction: ', JSON.stringify(data))),
    )
  ).pipe(
    scan((acc, value) => (value instanceof Array) ? [ ...value ] : this.modifyTransactions(acc, value), [] as ITransaction[]),
    shareReplay(1),
    tap(data => console.log('saveTransaction: ', JSON.stringify(data))),
  )

  private saveTransaction(operation: IAction<ITransaction>): Observable<IAction<ITransaction>> {
    const transaction = operation.item;

    if (operation.action === 'add') {
      return this.http.post<ITransaction>(this.transactionsUrl, transaction).pipe(
        map((transaction: ITransaction) => ({ item: transaction, action: operation.action }))
      );
    }

    /**
     * If we have more crud operations like update or delete we could include
     * the appropiate code to handle those operations
     */

    return of(operation);
  }

  private modifyTransactions(transactions: ITransaction[], operation: IAction<ITransaction>) {
    if (operation.action === 'add') {
      return [ ...transactions, operation.item ];
    }

    /**
     * Same like saveTransaction method, we could update or delete our transaction array
     * base on the operation type
     */

    return transactions;
  }

  addTransaction(transaction: ITransaction) {
    this.transactionModifiedSubject.next({
      action: 'add',
      item: transaction
    });
  }


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


