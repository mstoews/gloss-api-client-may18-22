import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { KanbanTaskFormComponent } from '../../kanban-form/kanban.task.form';
import { Observable } from 'rxjs';
import { KanbanService } from '../../module/kanban.service';
import { KanbanRefService } from '../../module/kanban-party-ref.service';

interface IType {
  type: string;
  description: string;
  updatedte: Date;
  updateusr: string;
}

interface IPriority {
  priority: string;
  description: string;
  updatedte: Date;
  updateusr: string;
}

export interface ITask {
  assignee: string;
  classname: string;
  color: string;
  dependencies: string;
  description: string;
  due_date: string;
  estimate: string;
  Id: string;
  parentId: number;
  party_ref: string;
  priority: string;
  rankid: number;
  start_date: string;
  status: string;
  summary: string;
  tags: string;
  task_id: string;
  title: string;
  type: string;
}

export interface IBoard {
  boardId: string;
  boards?: ITask[];
}

export type Query = {
  KanbanTaskByRef: ITask[];
};

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'tasks-list',
  templateUrl: './tasks-list.component.html',
})
export class TasksListComponent implements OnInit {
  allowDropInsideItem = true;
  allowReordering = true;
  showDragIcons = true;
  expandedRowKeys: Array<number> = [1];
  selectedTask: ITask;
  taskGql!: Observable<ITask[]>;

  @Input() public partyType = 'COMP';
  @Input() public partyRef = 'JPTC';

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
    this.taskGql = this.kanbanService.getKanbanTaskByRef(this.partyRef);
  }

  public refreshData() {
    this.taskGql = this.kanbanService.getKanbanTaskByRef(this.partyRef);
  }

  public refreshDataByRef(partyRef: string) {
    this.taskGql = this.kanbanService.getKanbanTaskByRef(partyRef);
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
