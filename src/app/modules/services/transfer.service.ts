import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITransaction } from '@models/transaction';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransferService {

  private transactionsUrl = 'api/transactions';

  constructor(
    private http: HttpClient
  ) { }

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
