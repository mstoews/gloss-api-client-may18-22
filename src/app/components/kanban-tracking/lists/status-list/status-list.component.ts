import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { KanbanService } from '../../module/kanban.service';

export type Query = {
  statusType: StatusType[];
};

export interface StatusType  {
  status: string;
  description: string;
  updatedte: string;
  updateusr: string;
}

@Component({
  selector: 'status-list',
  // templateUrl: './status-list.component.html',
  template: `
  <ng-container *ngIf="status | async as rows">
    <grid
      [cols]="cols"
      [rows]="rows"
      (notifyOpenDialog)="onNotify($event)"
    >
    </grid>
  </ng-container>
`,
})
export class StatusListComponent  {

  status!: Observable<StatusType[]>;
  cols: any;

  constructor(private kanbanService: KanbanService)
   {
    this.status = this.kanbanService.getKanbanStatus();
    this.cols = this.kanbanService.getStatusCols();
  }
}
