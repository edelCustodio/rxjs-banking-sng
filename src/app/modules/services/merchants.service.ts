import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IMerchant, IMerchantType } from '@models/merchant';
import { Observable, catchError, combineLatest, forkJoin, map, shareReplay, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MerchantsService {

  private merchantsUrl = 'api/merchants';
  private merchantsTypeUrl = 'api/merchantsType';

  constructor(
    private http: HttpClient,
  ) { }

  merchants$ = this.http.get<IMerchant[]>(this.merchantsUrl)
  .pipe(
    catchError(this.handleError),
    shareReplay(1)
  );

  merchantTypes$ = this.http.get<IMerchant[]>(this.merchantsTypeUrl)
  .pipe(
    catchError(this.handleError),
    shareReplay(1)
  );

  merchantsWithTypes$ = combineLatest([
    this.merchants$,
    this.merchantTypes$
  ]).pipe(map(([merchants, merchantsType]) => merchants.map((merchant: IMerchant) => ({
    ...merchant,
    merchantName: merchantsType.find(mt => mt.id === merchant.merchantTypeId)?.name
  } as IMerchant))));

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
