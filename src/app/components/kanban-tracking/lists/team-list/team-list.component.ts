import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { KanbanService } from '../../module/kanban.service';

export interface ITeam {
  team_member: string;
  first_name: string;
  last_name: string;
  location: string;
  title: string;
}

@Component({
  selector: 'team-list',
  template: `
    <ng-container *ngIf="team$ | async as team">
      <grid
        [cols]="cols"
        [rows]="team"
        (notifyFileUpload)="onFileUpload($event)"
        (notifyOpenDialog)="onNotify($event)"
      >
      </grid>
    </ng-container>
  `,
})
export class TeamListComponent {
  team$!: Observable<ITeam[]>;
  cols: any;

  constructor(private kanbanService: KanbanService) {
    this.team$ = this.kanbanService.getKanbanTeam();
    this.cols = this.kanbanService.getTeamCols();
  }
}
