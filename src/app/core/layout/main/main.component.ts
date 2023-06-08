import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, ViewChild } from '@angular/core';
import { Observable, delay } from 'rxjs';
import { SideNavService } from '../services/side-nav.service';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'sbank-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  @ViewChild(MatSidenav, { static: false })
  sidenav!: MatSidenav;

  responsive$: Observable<BreakpointState> = this.observer.observe(['(max-width: 800px)']).pipe(delay(1));

  constructor(
    private observer: BreakpointObserver,
    private sideNavService: SideNavService
  ) {}

  openedChange(open: boolean) {
    this.sideNavService.setSideNav(this.sidenav);
  }
}
