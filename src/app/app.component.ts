import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { NavigationEnd, Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { Observable, delay, filter, fromEvent } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'banking-sng';

  constructor(
    private router: Router
  ) {}

  ngAfterViewInit() {


    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd)
      )
      .subscribe(() => {
        // if (this.sidenav.mode === 'over') {
        //   this.sidenav.close();
        // }
      });
  }
}


