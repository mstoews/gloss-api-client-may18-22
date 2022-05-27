import {
  Component,
  HostBinding,
  Input,
  OnInit,
  AfterContentInit,
  AfterViewInit,
} from '@angular/core';
import { NavItem } from './nav-item';
import { Router } from '@angular/router';
import { NavService } from './nav-service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-nav-list-item',
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.scss'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(180deg)' })),
      transition(
        'expanded <=> collapsed',
        // animate('1000ms cubic-bezier(0.4,0.0,0.2,1)')
        animate('1000ms cubic-bezier(1,0.0,1,1)')
      ),
    ]),
  ],
})
export class NavItemComponent implements OnInit {
  public expanded!: boolean;
  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  @Input() item: NavItem;
  @Input() depth: number;
  private noMenuUpdate = true;

  constructor(public navService: NavService, public router: Router) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
  }

  ngOnInit() {
    this.navService.currentUrl.subscribe((url: string) => {
      if (url === null || url === undefined) {
        this.expanded = false;
      } else if (this.item.route) {
        const expand = url.indexOf(`${this.item.route}`);
        if (expand === 0) {
          this.expanded = false;
        }
        this.ariaExpanded = this.expanded;
      }
    });
    this.ariaExpanded = this.expanded;
  }

  onItemSelected(item: NavItem) {
    console.log('on selected ..');
    if (item.parent) {
      this.expanded = !this.expanded;
    } else {
      this.expanded = true;
      this.router.navigate([item.route]);
    }
  }
}
