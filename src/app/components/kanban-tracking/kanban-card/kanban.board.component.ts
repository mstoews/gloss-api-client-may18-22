/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { KanbanService } from '../module/kanban.service';
import { Subscription } from 'rxjs';
import { ITask, IBoard } from '../module/tasks.model';
import { MatDialog } from '@angular/material/dialog';
import { KanbanTaskFormComponent } from '../kanban-form/kanban.task.form';
import { PartyService } from 'app/services/party.service';
import { Router } from '@angular/router';
import { KanbanRefService } from '../module/kanban-party-ref.service';
import { MatSidenav } from '@angular/material/sidenav';
import { IMenuState } from '../module/tasks.model';

@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban.board.component.html',
  styleUrls: ['./kanban.board.component.scss'],
})
export class KanbanBoardComponent implements OnInit, OnDestroy {
  constructor(
    public dialog: MatDialog,
    public partyService: PartyService,
    public kanbanService: KanbanService,
    public kanbanRefService: KanbanRefService,
    private router: Router
  ) {}

  // notify
  @Output() notifyUpdateTaskData: EventEmitter<ITask> = new EventEmitter();

  public outTitle = 'KANBAN';
  public partyRef: string;
  party: KanbanRefService;

  OPEN = 'Open';
  IN_PROGRESS = 'InProgress';
  IN_REVIEW = 'InReview';
  COMPLETED = 'Completed';
  selected: string;

  subOpen: Subscription;
  subProgress: Subscription;
  subReview: Subscription;
  subComplete: Subscription;

  openTasks: ITask[];
  progressTasks: ITask[];
  reviewTasks: ITask[];
  completeTasks: ITask[];
  clientRef: string;

  private igMenuChanged: Subscription;

  // the following logic should be built out into multi dimentional array of broads and tasks
  allBoards: IBoard[];
  public selectedTask: any;

  @ViewChild('drawer') public sidenav: MatSidenav;

  ngOnInit(): void {
    //  console.log ('Refreshing KanbanBoard ... ngOnInit', this.partyRef);
    this.igMenuChanged = this.kanbanRefService.kanbanRefUpdated.subscribe(
      (menuState: IMenuState) => {
        this.partyRef = menuState.partyRef;
        this.clientRef = menuState.clientRef;
        this.refreshData(this.partyRef);
      }
    );
    if (this.partyRef === undefined) {
      this.onInitGetKanbanByType('COMP');
    } else {
      this.refreshData(this.partyRef);
    }
  }

  onModifyTaskDialog(data: ITask) {
    // this.kanbanService.setTask(data);
    // this.sidenav.toggle();
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
    this.refreshData(data.party_ref);
  }

  update(data) {
    this.kanbanService
      .KanbanUpdate(data.task_id, data)
      .subscribe((value) => this.refreshData(data.party_ref));
    this.refreshDataW();
  }

  delete(data) {
    this.kanbanService.kanbanDelete(data.task_id).subscribe(
      (value) => {
        this.refreshData(data.party_ref);
      },
      (error) => {
        console.log(error.message);
      }
    );
  }

  public refreshDataW() {
    //  console.log ('this party ref', this.partyRef);
    this.kanbanService
      .getKanbanTaskByRef(this.partyRef)
      .subscribe((task) => (this.allBoards = task));
  }

  onVerify(data) {
    //  console.log (`Verify data: ${data}`);
  }

  onInitGetKanbanByType(partyType: string) {
    this.partyService.getFirstPartyByType(partyType).subscribe((val) => {
      if (this.partyRef === undefined) {
        this.partyRef = val.party_ref;
        this.kanbanRefService.setPartyRef(val.party_ref);
      }
      this.refreshData(this.partyRef);
    });
  }

  public refreshData(partyRef: string) {
    this.subOpen = this.kanbanService
      .getKanbanTaskByRefAndStatus(partyRef, this.OPEN)
      .subscribe((task) => (this.openTasks = task));

    this.subProgress = this.kanbanService
      .getKanbanTaskByRefAndStatus(partyRef, this.IN_PROGRESS)
      .subscribe((task) => (this.progressTasks = task));

    this.subReview = this.kanbanService
      .getKanbanTaskByRefAndStatus(partyRef, this.IN_REVIEW)
      .subscribe((task) => (this.reviewTasks = task));

    this.subComplete = this.kanbanService
      .getKanbanTaskByRefAndStatus(partyRef, this.COMPLETED)
      .subscribe((task) => (this.completeTasks = task));
  }

  drop(event: CdkDragDrop<string[]>): void {
    // transfers position of the data in memory,
    // if the drop was within the same container and reordering only Index is the position vertically

    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.updateBoardRanking(event.container.data);
    } else {
      // transfer data to new container in memory only, if the drop was to a new container or board in our case
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.updateBoards(
        event.previousContainer.data,
        event.container.data,
        event.container.id
      );
    }
  }

  private updateBoardRanking(previousData: any) {
    // loop through just the previous day
    // previous status is the same so not updated
    const cnt = previousData.length;
    if (cnt > 0) {
      let i = 1;
      previousData.forEach((task) => {
        task.rankid = i;
        this.kanbanService.KanbanUpdate(task.task_id, task).subscribe({
          next: (value) => console.log(`Previous container data: ${value}`),
        });
        i++;
      });
    }
  }

  private updateBoards(
    previousData: any,
    newData: any,
    newContainerId: string
  ) {
    // previous status is the same so not updated
    this.updateBoardRanking(previousData);

    // loop through the board updated to set the status an rank.
    const cnt = newData.length;
    if (cnt > 0) {
      let i = 1;
      newData.forEach((task) => {
        task.status = newContainerId;
        task.rankid = i;
        this.kanbanService.KanbanUpdate(task.task_id, task).subscribe({
          next: (value) => console.log(`New container data: ${value}`),
        });
        i++;
      });
    }
  }

  ngOnDestroy() {
    this.subOpen.unsubscribe();
    this.subProgress.unsubscribe();
    this.subReview.unsubscribe();
    this.subComplete.unsubscribe();
  }
}
