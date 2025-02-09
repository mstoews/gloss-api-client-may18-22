/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { map, takeLast } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as glossApi from 'app/services/api.service';
import { ITask } from './tasks.model';

export type TaskArray = {
  tasks: ITask[];
};

@Injectable({
  providedIn: 'root',
})
export class KanbanService {
  public PRIORITY: glossApi.Kb_Priority[];

  private partyRef: string;
  private partyType: string;
  private clientRef: string;
  private selectedTab: string;
  private isPartyTypeSelected: boolean;

  constructor(
    // Kanban Task
    private readonly kanbanTasks: glossApi.KanbanTasksGQL,
    private readonly kanbanPriority: glossApi.KanbanPriorityGQL,
    private readonly kanbanByStatus: glossApi.KanbanByStatusGQL,
    private readonly kanbanUpdateTask: glossApi.UpdateTaskGQL,
    private readonly kanbanCreateTask: glossApi.CreateKanbanTaskGQL,
    private readonly kanbanStatus: glossApi.KanbanStatusGQL,
    private readonly kanbanType: glossApi.KanbanTypeGQL,
    private readonly kanbanDeleteTask: glossApi.DeleteTaskGQL,
    private readonly kanbanTaskByRefAndStatus: glossApi.KanbanTaskByRefAndStatusGQL,
    private readonly kanbanTaskByRef: glossApi.KanbanTaskByRefGQL,
    private readonly firstKanbanTask: glossApi.KanbanFirstTaskGQL,
    private readonly kanbanTaskByTaskId: glossApi.KanbanTaskByTaskIdGQL,
    private readonly updateTaskParentId: glossApi.UpdateTaskParentIdGQL,
    private readonly partyByTypeGQL: glossApi.PartyByTypeGQL
  ) {}

  // tslint:disable-next-line:variable-name
  public getPartyByRefAndClient(party_type: string, client_ref: string) {
    return this.partyByTypeGQL
      .watch({ party_type, client_ref })
      .valueChanges.pipe(map((result) => result.data.partyByType));
  }

  public getFirstKanbanTaskRef() {
    return this.firstKanbanTask
      .watch()
      .valueChanges.pipe(map((result) => result.data.KanbanFirstTask));
  }

  public getTaskbyTaskId(taskId: string) {
    return this.kanbanTaskByTaskId
      .watch({ task_id: taskId })
      .valueChanges.pipe(map((result) => result.data.KanbanByTaskId));
  }

  public updateTaskParent(taskId: string, parentId: number) {
    return this.updateTaskParentId.mutate({
      task_id: taskId,
      parentId,
    });
  }

  public KanbanCreate(task: glossApi.KanbanInputs) {
    return this.kanbanCreateTask.mutate({
      taskInput: task,
    });
  }

  public getKanbanStatus() {
    return this.kanbanStatus
      .watch()
      .valueChanges.pipe(map((result) => result.data.KanbanStatus));
  }

  public getKanbanType() {
    return this.kanbanType
      .watch()
      .valueChanges.pipe(map((result) => result.data.KanbanType));
  }

  public getKanbanTasks() {
    return this.kanbanTasks
      .watch()
      .valueChanges.pipe(map((result) => result.data.KanbanTask));
  }

  public getKanbanTaskByRef(partyRef: string): Observable<any> {
    return this.kanbanTaskByRef
      .watch({ party_ref: partyRef })
      .valueChanges.pipe(map((result) => result.data.KanbanTaskByRef));
  }

  public getKanbanTaskByRefAndStatus(partyRef: string, status: string) {
    return this.kanbanTaskByRefAndStatus
      .watch({ partyRef, status })
      .valueChanges.pipe(map((result) => result.data.KanbanTaskByRefAndStatus));
  }

  public getKanbanByStatus(status: string) {
    return this.kanbanByStatus
      .watch({ status })
      .valueChanges.pipe(map((result) => result.data.KanbanTaskByStatus));
  }

  public getKanbanPriorities() {
    return this.kanbanPriority
      .watch()
      .valueChanges.pipe(map((result) => result.data.KanbanPriority));
  }

  public KanbanUpdate(taskId: string, taskData: glossApi.KanbanInputs) {
    return this.kanbanUpdateTask.mutate({
      task_id: taskId,
      taskInput: taskData,
    });
  }

  public kanbanDelete(task: glossApi.KanbanInputs): any {
    return this.kanbanDeleteTask.mutate({
      task_id: task.task_id,
    });
  }

  dateFormatter(params) {
    const dateAsString = params.value;
    // //  console.log (dateAsString.slice(0, 10));
    const dateParts = dateAsString.split('-');
    return `${dateParts[0]} - ${dateParts[1]} - ${dateParts[2].slice(0, 2)}`;
  }

  public getPriorityCols() {
    const cols = [
      { headerName: 'Priority', field: 'priority' },
      { headerName: 'Description', field: 'description' },
      { headerName: 'User', field: 'updateusr' },
      {
        headerName: 'Date Updated',
        field: 'updatedte',
        minWidth: 150,
        filter: 'agDateColumnFilter',
        valueFormatter: this.dateFormatter,
      },
    ];
    return cols;
  }

  public getStatusCols() {
    const cols = [
      { headerName: 'Priority', field: 'status' },
      { headerName: 'Description', field: 'description' },
      { headerName: 'User', field: 'updateusr' },
      {
        headerName: 'Date Updated',
        field: 'updatedte',
        minWidth: 150,
        filter: 'agDateColumnFilter',
        valueFormatter: this.dateFormatter,
      },
    ];
    return cols;
  }

  public getTypeCols() {
    const cols = [
      { headerName: 'Priority', field: 'type' },
      { headerName: 'Description', field: 'description' },
      { headerName: 'User', field: 'updateusr' },
      {
        headerName: 'Date Updated',
        field: 'updatedte',
        minWidth: 150,
        filter: 'agDateColumnFilter',
        valueFormatter: this.dateFormatter,
      },
    ];
    return cols;
  }

  public getPartyCols() {
    const cols = [
      { headerName: 'Reference', field: 'party_ref' },
      { headerName: 'Type', field: 'party_type' },
      { headerName: 'Short Name', field: 'party_short_name' },
      { headerName: 'Long Name', field: 'party_long_name' },
      { headerName: 'Extra Long Name', field: 'party_extra_long_name' },
      { headerName: 'Date', field: 'version_date' },
      { headerName: 'User', field: 'version_user' },
    ];
    return cols;
  }

  public getTaskCols() {
    const cols = [
      { headerName: 'Task', field: 'task_id' },
      { headerName: 'Party Ref', field: 'party_ref' },
      { headerName: 'Title', field: 'title' },
      { headerName: 'Description', field: 'description' },
      { headerName: 'Status', field: 'status' },
      { headerName: 'Summary', field: 'summary' },
      { headerName: 'Type', field: 'type' },
      { headerName: 'Priority', field: 'priority' },
      { headerName: 'Tags', field: 'tags' },
      { headerName: 'Estimate', field: 'estimate' },
      { headerName: 'Assignee', field: 'assignee' },
      { headerName: 'Start Date', field: 'start_date' },
      { headerName: 'Due Date', field: 'due_date' },
    ];
    return cols;
  }
}
