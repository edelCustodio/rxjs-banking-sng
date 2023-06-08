import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IMerchant, IMerchantType } from '@models/merchant';
import { Observable, forkJoin, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MerchantsService {

  private merchantsUrl = 'api/merchants';
  private merchantsTypeUrl = 'api/merchantsType';

  constructor(
    private http: HttpClient,
  ) { }

  getMerchants(): Observable<IMerchant[]> {
    return this.http.get<IMerchant[]>(this.merchantsUrl);
  }

  getMerchantsType(): Observable<IMerchantType[]> {
    return this.http.get<IMerchantType[]>(this.merchantsTypeUrl);
  }

  getMerchantsWithType() {
    return forkJoin([
      this.getMerchants(),
      this.getMerchantsType()
    ]).pipe(map(([merchants, merchantsType]) => merchants.map((merchant: IMerchant) => ({
      ...merchant,
      merchantName: merchantsType.find(mt => mt.id === merchant.merchantTypeId)?.name
    } as IMerchant))))
  }
}
