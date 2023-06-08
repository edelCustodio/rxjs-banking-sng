import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITransaction } from '@models/transaction';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransferService {

  private transactionsUrl = 'api/transactions';

  constructor(
    private http: HttpClient,
  ) { }

  postTransaction(transaction: ITransaction): Observable<ITransaction> {
    return this.http.post<ITransaction>(this.transactionsUrl, transaction);
  }

}
