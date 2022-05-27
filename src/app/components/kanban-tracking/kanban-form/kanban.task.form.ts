import {
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import moment from 'moment';
import { Subject, Subscription } from 'rxjs';
import { KanbanService } from '../module/kanban.service';
import {
  IAssignee,
  IKanbanTask,
  IValue,
  IPriority,
} from '../module/tasks.model';

@Component({
  selector: 'app-task-form',
  templateUrl: './kanban.task.form.html',
  styleUrls: ['./kanban.scss'],
})
export class KanbanTaskFormComponent implements OnInit, OnDestroy {
  taskGroup: FormGroup;
  action: string;
  // tslint:disable-next-line: variable-name
  party: string;
  sTitle: string;
  cPriority: string;
  cRAG: string;
  cType: string;
  currentDate: Date;
  @Input() colorCode: string;

  subType: Subscription;

  private unsubscribeAll: Subject<any> = new Subject<any>();

  types: IValue[] = [
    { value: 'add', viewValue: 'ADD' },
    { value: 'update', viewValue: 'UPDATE' },
    { value: 'delete', viewValue: 'REMOVE' },
    { value: 'verify', viewValue: 'VERIFY' },
  ];

  rag: IValue[] = [
    { value: '#238823', viewValue: 'GREEN' },
    { value: '#FFBF00', viewValue: 'AMBER' },
    { value: '#D2222D', viewValue: 'RED' },
  ];

  priorities: IValue[] = [
    { value: 'Critical', viewValue: 'CRITICAL' },
    { value: 'High', viewValue: 'HIGH' },
    { value: 'Medium', viewValue: 'MEDIUM' },
    { value: 'Low', viewValue: 'LOW' },
  ];

  subTeam: Subscription;
  team: IAssignee[];

  constructor(
    public dialogRef: MatDialogRef<KanbanTaskFormComponent>,
    private fb: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    public kanbanService: KanbanService,
    @Optional() @Inject(MAT_DIALOG_DATA) public task: IKanbanTask
  ) {
    this.createForm(task);
  }

  ngOnDestroy(): void {
    this.subTeam.unsubscribe();
  }

  ngOnInit() {
    this.taskGroup.valueChanges.subscribe((value) => {
      this.changeDetectorRef.markForCheck();
    });
    this.subTeam = this.kanbanService
      .getKanbanTeam()
      .subscribe((teamMember) => (this.team = teamMember));
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  isOverdue(): boolean {
    return moment(this.task.due_date, moment.ISO_8601).isBefore(
      moment(),
      'days'
    );
  }

  changePriority(data) {
    this.cPriority = data;
  }

  changeRag(data) {
    this.cRAG = data;
  }

  changeType(data) {
    this.cType = data;
  }

  createForm(task: IKanbanTask) {
    this.sTitle = 'Kanban Task - ' + task.task_id;
    const dDate = new Date(task.due_date);
    const dueDate = dDate.toISOString().split('T')[0];

    const sDate = new Date(task.start_date);
    const startDate = sDate.toISOString().split('T')[0];

    this.assignPriority(task);
    this.assignType(task);
    this.assignRag(task);

    this.taskGroup = this.fb.group({
      task_id: [task.task_id],
      party_ref: [task.party_ref],
      title: [task.title],
      status: [task.status],
      summary: [task.summary],
      type: [this.cType],
      priority: [this.cPriority],
      tags: [task.tags],
      estimate: [task.estimate],
      assignee: [task.assignee],
      rankid: [task.rankid],
      color: [this.cRAG],
      description: [task.description],
      due_date: [dueDate],
      start_date: [startDate],
      dependencies: [task.dependencies],
    });
  }

  private assignRag(task: IKanbanTask) {
    if (task.type !== null && task.type !== undefined) {
      const type = this.types.find((x) => x.value === task.type.toString());
      if (type === undefined) {
        this.cType = 'ADD';
      } else {
        this.cType = type.value;
      }
    } else {
      this.cType = 'ADD';
    }
  }

  private assignType(task: IKanbanTask) {
    if (task.color !== null && task.color !== undefined) {
      const rag = this.rag.find((x) => x.value === task.color.toString());
      if (rag === undefined) {
        this.cRAG = '#238823';
      } else {
        this.cRAG = rag.value;
      }
    } else {
      this.cRAG = '#238823';
    }
  }

  private assignPriority(task: IKanbanTask) {
    if (this.priorities !== undefined) {
      const priority = this.priorities.find(
        (x) => x.value === task.priority.toString()
      );
      if (priority !== undefined) {
        this.cPriority = priority.value;
      } else {
        this.cPriority = 'MEDIUM';
      }
    } else {
      this.cPriority = 'MEDIUM';
    }
  }

  onCreate(data) {
    data = this.taskGroup.getRawValue();
    this.dialogRef.close({ event: 'Create', data });
  }

  onUpdate(data) {
    data = this.taskGroup.getRawValue();
    this.dialogRef.close({ event: 'Update', data });
  }

  onDelete(data) {
    data = this.taskGroup.getRawValue();
    this.dialogRef.close({ event: 'Delete', data });
  }

  onVerify(data) {
    //  console.log (`OnVerify ${data}`);
  }

  onAddComment(data) {
    //  console.log (`onADdComment ${data}`);
  }

  onAssignment(data) {
    //  console.log (`${data}`);
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
