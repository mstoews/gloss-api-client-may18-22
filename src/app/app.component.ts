import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { SidenavService } from './components/kanban-tracking/sidenav.service';
import { MatSidenav } from '@angular/material/sidenav';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements AfterViewInit {
  title = 'glossconfig';
  public isAuthenticated: boolean;
  @ViewChild('sidenav') public sidenav: MatSidenav;
  constructor(private sidenavService: SidenavService) {
    this.isAuthenticated = true;
  }
  login() {}
  logout() {}

  ngAfterViewInit(): void {
    // this.sidenavService.setSidenav(this.sidenav);
  }
}
