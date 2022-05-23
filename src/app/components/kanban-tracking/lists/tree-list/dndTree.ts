import {
  Component,
  OnInit,
  ɵCompiler_compileModuleSync__POST_R3__,
} from '@angular/core';
import { ITreeState, ITreeOptions } from '@circlon/angular-tree-component';
import { v4 } from 'uuid';
import { Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { KanbanService } from '../../module/kanban.service';
import { KanbanRefService } from '../../module/kanban-party-ref.service';
import { ITask } from '../interface.types';

export interface Node {
  id: number;
  name: string;
  children: any[];
}

@Component({
  selector: 'app-basictree',
  template: `
    <ng-container *ngIf="tree">
      <mat-card>
        <mat-card-title> Task Dependency Maintenance </mat-card-title>
        <tree-root
          [state]="state"
          [options]="options"
          [focused]="true"
          [nodes]="tree"
        >
        </tree-root>
      </mat-card>
      ></ng-container
    >
  `,
  styles: [],
})
export class DnDTreeComponent implements OnInit {
  selectedTask: ITask;
  task!: Observable<ITask[]>;
  partyRef = 'C030';
  state: ITreeState = {
    expandedNodeIds: {
      1: true,
      2: true,
    },
    hiddenNodeIds: {},
    activeNodeIds: {},
  };

  options: ITreeOptions = {
    allowDrag: (node) => true,
    allowDragoverStyling: true,
    getNodeClone: (node) => ({
      ...node.data,
      id: v4(),
      name: `copy of ${node.data.name}`,
    }),
  };
  nodes = [
    {
      id: 1,
      name: 'Task 1',
      children: [],
    },
    {
      id: 2,
      name: 'Task 2',
      children: [],
    },
    {
      id: 3,
      name: 'Task 3',
      children: [],
    },
  ];

  constructor(
    private kanbanService: KanbanService,
    private kanbanRefServie: KanbanRefService
  ) {
    this.task = this.kanbanService.getKanbanTaskByRef(this.partyRef);
  }

  public tree: Node[] = [];

  ngOnInit(): void {
    this.task = this.kanbanService.getKanbanTaskByRef(this.partyRef);
    const treeItems = this.task.pipe(
      map((val) => {
        for (const item of val) {
          const id = Number(item.Id);
          const parent = item.parentId;
          const node: Node = {
            id,
            name: item.description,
            children: [],
          };
          console.log(node);
          this.tree.push(node);
        }
      })
    );
    treeItems.subscribe({
      next: (val) => console.log(val),
    });
  }
}
