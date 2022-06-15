/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/member-ordering */
import {
  Component,
  EventEmitter,
  OnInit,
  ViewChild,
  Output,
} from '@angular/core';
import { KanbanGroupComponent } from '../kanban-group/kanban.group.component';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { throwError, Observable } from 'rxjs';
import { KanbanService } from '../module/kanban.service';
import { MatDrawer } from '@angular/material/sidenav';

import { PartyService } from 'app/services/party.service';
import { KanbanRefService } from '../module/kanban-party-ref.service';
import { IMenuState } from '../module/tasks.model';
interface IValue {
  value: string;
  viewValue: string;
  menuDesc: string;
}

@Component({
  selector: 'app-kanban-main',
  templateUrl: './kanban.main.component.html',
  styleUrls: ['./kanban.main.component.scss'],
})
export class KanbanMainComponent implements OnInit {
  constructor(
    public partyService: PartyService,
    public kanbanService: KanbanService,
    public kanbanRefService: KanbanRefService,
    public dialog: MatDialog
  ) {}
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  drawerMode: 'side' | 'over';
  outTitle = 'COMP';
  outPartyRef: string;
  partyRef: string;
  clientRef: string;
  currentSelection: string;
  menuState: IMenuState;

  public partyReference$: Observable<any>;
  @ViewChild(KanbanGroupComponent)
  private kanbanGroupComponent: KanbanGroupComponent;
  currentTab = 1;

  @Output() notifyParentMenu: EventEmitter<any> = new EventEmitter();

  onAdd() {}

  onClone() {}

  onBackdropClicked() {}

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return errorMessage;
  }

  onRefreshPartyRef(event) {
    //  console.log ('onRefreshPartRef :', event);
    this.notifyParentMenu.emit(event);
  }

  ngOnInit() {
    this.partyReference$ = this.partyService.getPartyByType(this.outTitle);

    this.partyReference$.subscribe({
      next: (val) => {
        let count = 1;
        val.forEach((element) => {
          const item: IValue = {
            value: count.toString(),
            menuDesc: element.party_long_name,
            viewValue: element.party_ref,
          };
          // this.menuItems.push(item);
          count++;
        });
      },
      error: (err) => console.log(err.message),
    });
    this.partyService.getFirstPartyByType(this.outTitle).subscribe({
      next: (val) => {
        this.partyRef = val.party_ref;
        const menuState = {
          partyRef: val.party_ref,
          partyClient: localStorage.getItem('CLIENT'),
          partyType: val.party_type,
        };
        this.kanbanRefService.setMenuState(menuState);
      },
      error: (err) => console.log(err.message),
    });
  }

  onMenuItemChanged(partyRef) {
    this.kanbanRefService.setPartyRef(partyRef);
  }

  onRefresh() {
    //  console.log ('kanbanMain: OnRefresh: ', this.partyRef);
    this.kanbanGroupComponent.updateKanbanTasks();
  }

  OnDestroy() {
    // this.kanbanService.
  }

  onRowDblClick(e) {
    //  console.log (`On row double click ${e.data}`);
  }
}
