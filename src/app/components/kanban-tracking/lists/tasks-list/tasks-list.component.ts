import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { KanbanTaskFormComponent } from '../../kanban-form/kanban.task.form';
import { Observable } from 'rxjs';
import { KanbanService } from '../../module/kanban.service';
import { KanbanRefService } from '../../module/kanban-party-ref.service';
import { ITask } from '../interface.types';

export type Query = {
  KanbanTaskByRef: ITask[];
};

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'tasks-list',
  // templateUrl: './tasks-list.component.html',
  template: `
    <ng-container *ngIf="task | async as rows">
      <grid [cols]="cols" [rows]="rows" (notifyOpenDialog)="onNotify($event)">
      </grid>
    </ng-container>
  `,
})
export class TasksListComponent implements OnInit {
  allowDropInsideItem = true;
  allowReordering = true;
  showDragIcons = true;
  expandedRowKeys: Array<number> = [1];
  selectedTask: ITask;
  task!: Observable<ITask[]>;

  @Input() public partyType = 'COMP';
  @Input() public partyRef = 'JPTC';
  cols: any;

  constructor(
    public dialog: MatDialog,
    public kanbanService: KanbanService,
    public kanbanRefService: KanbanRefService
  ) {
    kanbanRefService.kanbanRefUpdated.subscribe((kanban) => {
      this.partyRef = kanban.getPartyRef();
      this.refreshDataByRef(this.partyRef);
      //  console.log ('Refreshing TaskListComponent', this.partyRef);
    });
  }

  ngOnInit() {
    this.task = this.kanbanService.getKanbanTaskByRef(this.partyRef);
    this.cols = this.kanbanService.getTaskCols();
  }

  public refreshData() {
    this.task = this.kanbanService.getKanbanTaskByRef(this.partyRef);
  }

  public refreshDataByRef(partyRef: string) {
    this.task = this.kanbanService.getKanbanTaskByRef(partyRef);
  }

  selectTask(e) {
    e.component.byKey(e.currentSelectedRowKeys[0]).done((task) => {
      if (task) {
        this.selectedTask = task;
      }
    });
  }

  onRowDblClick(e) {
    this.onModifyTaskDialog(e.data);
  }

  onModifyTaskDialog(data) {
    this.openDialog(data, 'Kanban Tasks');
  }

  openDialog(jsonData: any, title: string) {
    const dialogRef = this.dialog.open(KanbanTaskFormComponent, {
      width: '750px',
      data: jsonData,
    });
    dialogRef.afterClosed().subscribe((result) => {
      switch (result.event) {
        case 'Create':
          this.create(result.data);
          break;
        case 'Update':
          this.update(result.data);
          break;
        case 'Delete':
          this.delete(result.data);
          break;
        case 'Cancel':
          break;
      }
    });
  }

  create(data) {
    this.kanbanService.KanbanCreate(data);
    this.refreshData();
  }

  update(data) {
    this.kanbanService.KanbanUpdate(data.task_id, data).subscribe(
      (value) => {
        // this.kanbanService.partySnackMessage( 'The party reference was updated: ', value.data.updatePartyByRef.party_ref),
        this.refreshData();
      },
      (error) => {
        //  console.log (error.message);
      }
    );
  }

  delete(data) {
    this.kanbanService.kanbanDelete(data.task_id);
    this.refreshData();
  }
}
