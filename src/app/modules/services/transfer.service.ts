import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAction } from '@models/crud-actions';
import { ITransaction } from '@models/transaction';
import { Observable, Subject, catchError, concatMap, finalize, map, merge, mergeMap, of, scan, shareReplay, switchMap, tap, throwError } from 'rxjs';
import { TransactionsService } from './transactions.service';
import { UsersService } from './users.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TransferService {

  private transactionsUrl = 'api/transactions';

  private transactionModifiedSubject = new Subject<IAction<ITransaction>>();
  transactionModifiedAction$ = this.transactionModifiedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private transactionService: TransactionsService,
    private userService: UsersService,
    private router: Router
  ) { }

  transactionsWithCRUD$ = merge(
    this.transactionService.transactionsWithAllData$,
    this.transactionModifiedAction$.pipe(
      tap(data => console.log('transactionModifiedAction: ', JSON.stringify(data))),
      concatMap(operation => this.userService.userLoggedIn$.pipe(map(({ user }) => ( { ...operation, item: { ...operation.item, userId: user.id } } as IAction<ITransaction>)))),
      tap(data => console.log('transactionModifiedAction with User: ', JSON.stringify(data))),
      concatMap(operation => this.saveTransaction(operation)),
      tap(data => console.log('saveTransaction: ', JSON.stringify(data))),
    )
  ).pipe(
    scan((acc, value) => (value instanceof Array) ? [ ...value ] : this.modifyTransactions(acc, value), [] as ITransaction[]),
    shareReplay(1)
  ).pipe(
    finalize(() => this.router.navigate(['/transactions']))
  )

  saveTransaction(operation: IAction<ITransaction>): Observable<IAction<ITransaction>> {
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

  modifyTransactions(transactions: ITransaction[], operation: IAction<ITransaction>) {
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

  postTransaction(transaction: ITransaction): Observable<ITransaction> {
    return this.http.post<ITransaction>(this.transactionsUrl, transaction).pipe(catchError(this.handleError));
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
