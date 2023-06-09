import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser, IUserAccount } from '@models/user';
import { BehaviorSubject, Observable, Subject, catchError, combineLatest, map, mergeMap, shareReplay, switchMap, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private usersUrl = 'api/users';
  private userAccountsUrl = 'api/userAccounts';

  private saveUserSubject = new Subject<IUser>();
  public saveUser$ = this.saveUserSubject.asObservable();

  constructor(
    private http: HttpClient,
  ) { }

  user$ = this.http.get<IUser>(`${this.usersUrl}/1`)
  .pipe(
    shareReplay(1),
    tap(data => console.log('User: ', JSON.stringify(data))),
    catchError(this.handleError)
  );

  userLoggedIn$ = this.user$
  .pipe(
    switchMap((user: IUser) => this.http.get<IUserAccount[]>(`${this.userAccountsUrl}?userId=${user.id}`)
    .pipe(
      tap(data => console.log('UserAccounts: ', JSON.stringify(data))),
      map((userAccounts: IUserAccount[]) => ({ user, userAccounts }))
    )),
    shareReplay(1)
  )



  putUser$ = this.saveUser$.pipe(

  )

  updateUser(user: IUser) {
    this.saveUserSubject.next(user);
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
