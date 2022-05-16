import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TaskComponent } from '../kanban-card/tasks-card/task.component';
import { KanbanBoardComponent } from '../kanban-card/kanban.board.component';
import { KanbanMenubarComponent } from '../kanban-menubar/menubar.component';
import { KanbanGroupComponent } from '../kanban-group/kanban.group.component';
import { KanbanMainComponent } from '../kanban-main/kanban.main.component';
import { KanbanTaskFormComponent } from '../kanban-card/kanban-form/kanban.task.form';
import { TypeListComponent } from '../lists/type-list/type-list.component';
import { PriorityListComponent } from '../lists/priority-list/priority-list.component';
import { StatusListComponent } from '../lists/status-list/status-list.component';
import { TasksListComponent } from '../lists/tasks-list/tasks-list.component';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { DonutChartComponent } from '../pages/donut-chart/donut-chart.component';
import { BarLineChartComponent } from '../pages/bar-stacked-chart/bar-stacked-chart.component';
import { PartyListComponent } from '../lists/party/party.component';
import { GridCssComponent } from '../pages/grid-css/grid-css.component';
import { ComboLineChartComponent } from '../pages/combo-line-chart/combo-line-chart.component';
import { JiraDashboardComponent } from '../pages/jira-dashboard/jira-dashboard.component';
import { GanttComponent } from '../pages/gantt/gantt.component';
import { TreeComponent } from '../lists/dx-tree/dx-tree.component';
import { KanbanService } from '../module/kanban.service';
import { KanbanCommonModule } from './kanban.common.module';
import { KanbanRefService } from './kanban-party-ref.service';


const routes: Routes = [
  {
    path : 'kanban', component: KanbanMainComponent,
  },
  {
    path      : '**',
    redirectTo: 'kanban'
}
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
    DashboardComponent,
    DonutChartComponent,
    BarLineChartComponent,
    PartyListComponent,
    GridCssComponent,
    ComboLineChartComponent,
    JiraDashboardComponent,
    KanbanMenubarComponent,
    GanttComponent,
    TreeComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    KanbanCommonModule
  ],
  exports: [KanbanCommonModule],
  entryComponents: [KanbanMainComponent],
  providers: [KanbanService, KanbanRefService]
})
export class KanbanTasksModule {}
