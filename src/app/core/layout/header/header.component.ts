import { Component, Input, OnInit } from '@angular/core';
import { SideNavService } from '../services/side-nav.service';

@Component({
  selector: 'sbank-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent  {

  @Input() matches!: boolean;

  sideNav$ = this.sideNavService.sideNav$;

  constructor(
    private sideNavService: SideNavService
  ) {}

}
