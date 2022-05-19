import { Component } from '@angular/core';
import { timeStamp } from 'console';
import { Observable } from 'rxjs';
import { KanbanService } from '../../module/kanban.service';

export interface ActionType {
  type: string;
  description: string;
  updatedte: string;
  updateusr: string;
}
@Component({
  selector: 'action-type-list',
  // templateUrl: './type-list.component.html'
  template: `
    <ng-container *ngIf="actionType | async as rows">
      <grid [cols]="cols" [rows]="rows" (notifyOpenDialog)="onNotify($event)">
      </grid>
    </ng-container>
  `,
})
export class TypeListComponent {
  actionType!: Observable<ActionType[]>;
  cols: any;

  constructor(private kanbanService: KanbanService) {
    this.actionType = this.kanbanService.getKanbanType();
    this.cols = this.kanbanService.getTypeCols();
  }
}
