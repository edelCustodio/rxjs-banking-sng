import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SideNavService {

  private sideNav: Subject<MatSidenav> = new Subject<MatSidenav>();
  public sideNav$ = this.sideNav.asObservable();

  public setSideNav(nav: MatSidenav) {
    this.sideNav.next(nav);
  }

  constructor() { }
}
