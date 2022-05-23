import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { KanbanService } from '../../module/kanban.service';
import { PriorityFormComponent } from './priority.form';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { IPriority } from '../interface.types';

@Component({
  selector: 'priority-list',
  // templateUrl: './priority-list.component.html',
  template: `
    <ng-container *ngIf="priority$ | async as rows">
      <grid [cols]="cols" [rows]="rows" (notifyOpenDialog)="onNotify($event)">
      </grid>
    </ng-container>
  `,
})
export class PriorityListComponent implements OnInit {
  priority$;
  cols: any;

  constructor(
    private dialog: MatDialog,
    private kanbanService: KanbanService
  ) {}

  ngOnInit() {
    this.priority$ = this.kanbanService.getKanbanPriorities();
    this.cols = this.kanbanService.getPriorityCols();
    console.log(this.priority$);
  }

  public onNotify(event: any) {
    this.openDialog(event);
  }

  public updateData() {
    this.priority$ = this.kanbanService.getKanbanPriorities();
  }

  openDialog(jsonData: any) {
    //  console.log ('Party Narrative Data', jsonData);
    const dialogRef = this.dialog.open(PriorityFormComponent, {
      width: '380px',
      data: jsonData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      //  console.log ('Just before update', result.data);
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

  create(data: IPriority) {
    this.updateData();
  }

  update(data: IPriority) {
    this.updateData();
  }

  delete(data: IPriority) {
    this.updateData();
  }

  public onFileUpload(filedata: any) {
    const data = JSON.parse(filedata);
    // for (const element of data) {
    //   this.partyService.createPartyNarrative(element);
    // }
  }
}
