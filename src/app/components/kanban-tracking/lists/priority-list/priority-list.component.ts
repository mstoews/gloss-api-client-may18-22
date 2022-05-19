import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { KanbanService } from '../../module/kanban.service';


export type PriorityQuery = {
  priorityType: PriorityType[];
};

export interface PriorityType  {
  priority: string;
  description: string;
  updatedte: string;
  updateusr: string;
}
@Component({
  selector: 'priority-list',
  // templateUrl: './priority-list.component.html',
  template: `
    <ng-container *ngIf="priority$ | async as rows">
      <grid
        [cols]="cols"
        [rows]="rows"
        (notifyOpenDialog)="onNotify($event)"
      >
      </grid>
    </ng-container>
  `,
})

export class PriorityListComponent implements OnInit  {

    priority$;
    cols: any;

    constructor(private kanbanService: KanbanService) {}

    ngOnInit(){
      this.priority$ = this.kanbanService.getKanbanPriorities();
      this.cols = this.kanbanService.getPriorityCols();
      console.log(this.priority$);
    }

}
