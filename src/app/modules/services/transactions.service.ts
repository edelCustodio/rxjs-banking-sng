import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITransaction } from '@models/transaction';
import { Observable, Subject, catchError, combineLatest, concatMap, finalize, map, merge, mergeMap, of, scan, shareReplay, switchMap, tap, throwError } from 'rxjs';
import { UsersService } from './users.service';
import { MerchantsService } from './merchants.service';
import { AccountsService } from './accounts.service';
import { IAction } from '@models/crud-actions';
import { Router } from '@angular/router';
import { IUser, IUserAccount } from '@models/user';
import { IMerchant } from '@models/merchant';
import { IAccount } from '@models/account';

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
    private accountsService: AccountsService
  ) { }

  transactions$ = this.http.get<ITransaction[]>(this.transactionsUrl)
  .pipe(
    tap(data => console.log('Transactions: ', JSON.stringify(data))),
    catchError(this.handleError)
  );

  catalogs$ = combineLatest([
    this.usersService.userLoggedIn$,
    this.merchantsService.merchantsWithTypes$,
    this.accountsService.accountById$
  ]).pipe(
    map(([userLoggedIn, merchants, account]) => ({ userLoggedIn, merchants, account } as TCatalog)),
    shareReplay(1)
  )

  transactionsWithAllData$ = combineLatest([
    this.transactions$,
    this.catalogs$
  ])
  .pipe(
    map(([transactions, { userLoggedIn, merchants, account }]) => transactions.map(
      (transaction: ITransaction) => (this.mapTransaction(transaction, userLoggedIn.user, merchants, account)))
    ),
    tap(data => console.log('transactionsWithAllData: ', JSON.stringify(data)))
  )

  transactionsWithCRUD$ = merge(
    this.transactionsWithAllData$,
    this.transactionModifiedAction$.pipe(
      tap(data => console.log('transactionModifiedAction: ', JSON.stringify(data))),
      concatMap(operation => this.usersService.userLoggedIn$.pipe(map(({ user }) => ( { ...operation, item: { ...operation.item, userId: user.id } } as IAction<ITransaction>)))),
      tap(data => console.log('transactionModifiedAction with User: ', JSON.stringify(data))),
      concatMap(operation => this.saveTransaction(operation))
    )
  ).pipe(
    tap(data => console.log('transactionsWithCRUD: ', JSON.stringify(data))),
    scan((acc, value) => (value instanceof Array) ? [ ...value ] : this.modifyTransactions(acc, value), [] as ITransaction[]),
    map((transactions) => transactions.sort((a, b) => (Date.parse((new Date(b.date).toString())) - Date.parse((new Date(a.date)).toString())))),
    tap(data => console.log('transactionsWithCRUD: ', JSON.stringify(data))),
  )

  private saveTransaction(operation: IAction<ITransaction>): Observable<IAction<ITransaction>> {
    const transaction = operation.item;

    if (operation.action === 'add') {

      return combineLatest([
        this.http.post<ITransaction>(this.transactionsUrl, transaction),
        this.catalogs$,
      ]).pipe(
        map(([transaction, { userLoggedIn, merchants, account }]) => ({
          item: this.mapTransaction(transaction, userLoggedIn.user, merchants, account),
          action: operation.action } as IAction<ITransaction>))
      )
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

  private mapTransaction(transaction: ITransaction, user: IUser, merchants: IMerchant[], account: IAccount) {
    return {
      ...transaction,
      userName: user.firstName,
      merchantName: merchants.find(m => m.id === transaction.merchantId)?.name,
      merchantType: merchants.find(m => m.id === transaction.merchantId)?.merchantName,
      accountNumber: account.accountNumber
    } as ITransaction
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

type TCatalog = {
  userLoggedIn: {
      user: IUser;
      userAccounts: IUserAccount[];
  };
  merchants: IMerchant[];
  account: IAccount;
}


