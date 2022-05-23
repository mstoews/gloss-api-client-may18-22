import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TaskComponent } from '../kanban-card/tasks-card/task.component';
import { KanbanBoardComponent } from '../kanban-card/kanban.board.component';
import { KanbanMenubarComponent } from '../kanban-menubar/menubar.component';
import { KanbanGroupComponent } from '../kanban-group/kanban.group.component';
import { KanbanMainComponent } from '../kanban-main/kanban.main.component';
import { KanbanTaskFormComponent } from '../kanban-form/kanban.task.form';
import { TypeListComponent } from '../lists/type-list/type-list.component';
import { PriorityListComponent } from '../lists/priority-list/priority-list.component';
import { StatusListComponent } from '../lists/status-list/status-list.component';
import { TasksListComponent } from '../lists/tasks-list/tasks-list.component';
import { PartyListComponent } from '../lists/party-list/party.component';
import { GridCssComponent } from '../pages/grid-css/grid-css.component';
import { KanbanService } from '../module/kanban.service';
import { KanbanCommonModule } from './kanban.common.module';
import { KanbanRefService } from './kanban-party-ref.service';
import { GridAGModule } from '../../grid/gridAG.module';
import { DnDTreeComponent } from '../lists/tree-list/dndTree';
import { TreeModule } from '@circlon/angular-tree-component';
import { AgChartsAngularModule } from 'ag-charts-angular';
import { SidenavService } from '../sidenav.service';
import { PriorityFormComponent } from '../lists/priority-list/priority.form';
import { TypeFormComponent } from '../lists/type-list/types.form';
import { StatusFormComponent } from '../lists/status-list/status.form';
import { KanbanCloneComponent } from '../kanban-form/clone.form';

const routes: Routes = [
  {
    path: 'kanban',
    component: KanbanMainComponent,
  },
  {
    path: '',
    redirectTo: '/kanban',
    pathMatch: 'full',
  },
  {
    path: '**',
    component: KanbanMainComponent,
  },
];

@NgModule({
  declarations: [
    TaskComponent,
    KanbanBoardComponent,
    KanbanMainComponent,
    KanbanGroupComponent,
    KanbanTaskFormComponent,
    TypeListComponent,
    PriorityListComponent,
    StatusListComponent,
    TasksListComponent,
    PartyListComponent,
    GridCssComponent,
    KanbanMenubarComponent,
    DnDTreeComponent,
    PriorityFormComponent,
    TypeFormComponent,
    StatusFormComponent,
    KanbanCloneComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    KanbanCommonModule,
    GridAGModule,
    TreeModule,
    AgChartsAngularModule,
  ],
  exports: [KanbanCommonModule],
  entryComponents: [KanbanMainComponent],
  providers: [KanbanService, KanbanRefService, SidenavService],
})
export class KanbanTasksModule {}
